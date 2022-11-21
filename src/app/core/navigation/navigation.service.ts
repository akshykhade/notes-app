import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, ReplaySubject, tap } from 'rxjs';
import { Navigation } from 'app/core/navigation/navigation.types';
import { FuseNavigationItem } from '@fuse/components/navigation';
import { cloneDeep } from 'lodash';

@Injectable({
    providedIn: 'root'
})
export class NavigationService
{
    private _navigation: ReplaySubject<Navigation> = new ReplaySubject<Navigation>(1);

    private readonly _compactNavigation: FuseNavigationItem[] = compactNavigation;
    private readonly _defaultNavigation: FuseNavigationItem[] = defaultNavigation;
    private readonly _futuristicNavigation: FuseNavigationItem[] = futuristicNavigation;
    private readonly _horizontalNavigation: FuseNavigationItem[] = horizontalNavigation;


    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient)
    {
        this._compactNavigation.forEach((compactNavItem) => {
            this._defaultNavigation.forEach((defaultNavItem) => {
                if ( defaultNavItem.id === compactNavItem.id )
                {
                    compactNavItem.children = cloneDeep(defaultNavItem.children);
                }
            });
        });

        // Fill futuristic navigation children using the default navigation
        this._futuristicNavigation.forEach((futuristicNavItem) => {
            this._defaultNavigation.forEach((defaultNavItem) => {
                if ( defaultNavItem.id === futuristicNavItem.id )
                {
                    futuristicNavItem.children = cloneDeep(defaultNavItem.children);
                }
            });
        });

        // Fill horizontal navigation children using the default navigation
        this._horizontalNavigation.forEach((horizontalNavItem) => {
            this._defaultNavigation.forEach((defaultNavItem) => {
                if ( defaultNavItem.id === horizontalNavItem.id )
                {
                    horizontalNavItem.children = cloneDeep(defaultNavItem.children);
                }
            });
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for navigation
     */
    get navigation$(): Observable<Navigation>
    {
        return this._navigation.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get all navigation data
     */
    get(): Observable<Navigation>
    {
        const nav = {
            compact   : cloneDeep(this._compactNavigation),
            default   : cloneDeep(this._defaultNavigation),
            futuristic: cloneDeep(this._futuristicNavigation),
            horizontal: cloneDeep(this._horizontalNavigation)
        };
        this._navigation.next(nav);
        return of(nav);
    }
}

const defaultNavigation: FuseNavigationItem[] = [
    {
        id   : 'notes',
        title: 'Notes',
        type : 'basic',
        icon : 'heroicons_outline:clipboard-list',
        link : '/notes'
    }
];
const compactNavigation: FuseNavigationItem[] = [
    {
        id   : 'notes',
        title: 'Notes',
        type : 'basic',
        icon : 'heroicons_outline:clipboard-list',
        link : '/notes'
    }
];
const futuristicNavigation: FuseNavigationItem[] = [
    {
        id   : 'notes',
        title: 'Notes',
        type : 'basic',
        icon : 'heroicons_outline:clipboard-list',
        link : '/notes'
    }
];
const horizontalNavigation: FuseNavigationItem[] = [
    {
        id   : 'notes',
        title: 'Notes',
        type : 'basic',
        icon : 'heroicons_outline:clipboard-list',
        link : '/notes'
    }
];
