import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, of, switchMap, take, tap, throwError } from 'rxjs';
import { Label, Note } from 'app/modules/admin/apps/notes/notes.types';
import { cloneDeep } from 'lodash-es';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';

@Injectable({
    providedIn: 'root'
})
export class NotesService
{
    // Private
    private _labels: BehaviorSubject<Label[] | null> = new BehaviorSubject(null);
    private _note: BehaviorSubject<Note | null> = new BehaviorSubject(null);
    private _notes: BehaviorSubject<Note[] | null> = new BehaviorSubject(null);
    private _user:User = null;

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient,public _afs: AngularFirestore,private _userService:UserService)
    {
        _userService.user$.subscribe(u=>{
            this._user = u
        });
        // labels.forEach(l=>{
        //     const id = _afs.createId();
        //     delete l.id
        //     _afs.doc(`/notes/h34Pj8YwdEVb67lWIR5yVhKPvL42/labels/${id}`).set(l);
        // });
        // notes.forEach(n=>{
        //     const id = _afs.createId();
        //     delete n.id
        //     _afs.doc<Note>(`/notes/h34Pj8YwdEVb67lWIR5yVhKPvL42/notes/${id}`).set(n);
        // });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for labels
     */
    get labels$(): Observable<Label[]>
    {
        return this._labels.asObservable();
    }

    /**
     * Getter for notes
     */
    get notes$(): Observable<Note[]>
    {
        return this._notes.asObservable();
    }

    /**
     * Getter for note
     */
    get note$(): Observable<Note>
    {
        return this._note.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get labels
     */
    getLabels()
    {
        var col = this._afs.collection<Label[]>(`/notes/${this._user.localId}/labels`);

        col.valueChanges({ idField: 'id' }).subscribe(response=>{
            this._labels.next(response);
        });
    }

    /**
     * Add label
     *
     * @param title
     */
    addLabel(title: string)
    {
        const id = this._afs.createId();
        this._afs.doc(`/notes/${this._user.localId}/labels/${id}`).set({title});
    }

    /**
     * Update label
     *
     * @param label
     */
    updateLabel(label: Label): Observable<Label>
    {
        const id = label.id
        delete label.id
        this._afs.doc(`/notes/${this._user.localId}/label/${label.id}`).update(label);
        label.id = id;
        return of(label);
    }

    /**
     * Delete a label
     *
     * @param id
     */
    deleteLabel(id: string): Observable<boolean>
    {
        this._afs.doc(`/notes/${this._user.localId}/labels/${id}`).delete();
        return of(true);
    }

    /**
     * Get notes
     */
    getNotes():any
    {
        var col = this._afs.collection<Note[]>(`/notes/${this._user.localId}/notes`);
        col.valueChanges({ idField: 'id' }).subscribe(response=>{
            this._notes.next(response);
        });
    }

    /**
     * Get note by id
     */
    getNoteById(id: string): Observable<Note>
    {
        return this._notes.pipe(
            take(1),
            map((notes) => {

                // Find within the folders and files
                const note = notes.find(value => value.id === id) || null;

                // Update the note
                this._note.next(note);

                // Return the note
                return note;
            }),
            switchMap((note) => {

                if ( !note )
                {
                    return throwError('Could not found the note with id of ' + id + '!');
                }

                return of(note);
            })
        );
    }

    /**
     * Add task to the given note
     *
     * @param note
     * @param task
     */
    addTask(note: Note, task: string): Observable<Note>
    {
        const id = this._afs.createId();
        delete note.id
        this._afs.doc(`/notes/${this._user.localId}/notes/${id}`).set(note);
        note.id = id;
        return of(note);
    }

    /**
     * Create note
     *
     * @param note
     */
    createNote(note: Note): Observable<Note>
    {

        const id = this._afs.createId();
        delete note.id
        this._afs.doc(`/notes/${this._user.localId}/notes/${id}`).set(note);
        note.id = id;
        return of(note);
    }

    /**
     * Update the note
     *
     * @param note
     */
    updateNote(note: Note): Observable<Note>
    {
        // Clone the note to prevent accidental reference based updates
        const updatedNote = cloneDeep(note) as any;
        delete updatedNote.id
        this._afs.doc(`/notes/${this._user.localId}/notes/${note.id}`).update(updatedNote);

        return of(note);
    }

    /**
     * Delete the note
     *
     * @param note
     */
    deleteNote(note: Note): Observable<boolean>
    {
        this._afs.doc(`/notes/${this._user.localId}/notes/${note.id}`).delete();
        return of(true);
    }
}
