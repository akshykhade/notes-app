import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider } from 'firebase/auth';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable()
export class AuthService
{
    private _authenticated: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _userService: UserService,
        public _afAuth: AngularFireAuth
    )
    {
        this._afAuth.onAuthStateChanged(user=>{
            if(user) {
                this._authenticated = true;
                var user = user;
                this._userService.user = {email:user.email,localId:user.uid,name : user.displayName};
            }
            else {
                this._authenticated = false;
            }
        })
    }


    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Forgot password
     *
     * @param email
     */
    forgotPassword(email: string): Observable<any>
    {
        return of(this._afAuth.sendPasswordResetEmail(email));
    }

    /**
     * Reset password
     *
     * @param password
     */
    resetPassword(password: string): Observable<any>
    {
        return this._httpClient.post('api/auth/reset-password', password);
    }

    /**
     * Sign in
     *
     * @param credentials
     */
    signIn(credentials: { email: string; password: string }): Promise<any>
    {
        // Throw error, if the user is already logged in
        if ( this._authenticated )
        {
            return Promise.reject("User is already logged in.");
        }

        return this._afAuth.signInWithEmailAndPassword(credentials.email,credentials.password).then(result=>{
            this._authenticated = true;
            var user = result.user;
            this._userService.user = {email:user.email,localId:user.uid,name : user.displayName};

        });
    }

    signInWithGoogle(): Promise<any>
    {
        // Throw error, if the user is already logged in
        if ( this._authenticated )
        {
            return Promise.reject("User is already logged in.");
        }
        // Creates the provider object.
        var provider = new GoogleAuthProvider();
        // You can add additional scopes to the provider:
        provider.addScope('email');
        return this._afAuth.signInWithRedirect(provider);
    }


    /**
     * Sign out
     */
    signOut(): Observable<any>
    {

        // Set the authenticated flag to false
        this._authenticated = false;

        return of(this._afAuth.signOut());
    }

    /**
     * Sign up
     *
     * @param user
     */
    signUp(user: { name: string; email: string; password: string; company: string }): Promise<any>
    {
        return this._afAuth.createUserWithEmailAndPassword(user.email,user.password);
    }

    /**
     * Unlock session
     *
     * @param credentials
     */
    unlockSession(credentials: { email: string; password: string }): Observable<any>
    {
        return this._httpClient.post('api/auth/unlock-session', credentials);
    }

    /**
     * Check the authentication status
     */
    check(): Observable<boolean>
    {
        const result = new Observable<boolean>(ff=> {
            this._afAuth.authState.subscribe(user=>{
                if(user){
                    ff.next(true);
                    return;
                }
                ff.next(false);
            })
        });

        return result;
    }
}
