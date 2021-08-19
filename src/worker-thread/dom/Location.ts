/**
 * Copyright 2018 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Document} from './Document';
import { GetOrSet } from '../../transfer/Messages';
import { TransferrableMutationType } from '../../transfer/TransferrableMutation';
import { store } from '../strings';
import { transfer } from '../MutationTransfer';

// @see https://developer.mozilla.org/en-US/docs/Web/API/Location
export class Location {
    private _href: string;
    private _origin: string;
    private _protocol: string;
    private _host: string;
    private _hostname: string;
    private _port: string;
    private _pathname: string;
    private _search: string;
    private _hash: string;
    private _document: Document;

    /**
     * Getter for href
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Location/href
     * @return string href
     */
    get href(): string {
        return this._href;
    }

    /**
     * Setter for href
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Location/href
     * @param href
     */
    set href(href: string) {
        this._href = href;
        transfer(this._document, [TransferrableMutationType.LOCATION, GetOrSet.SET, store(this.toString())]);
    }

    /**
     * Getter for origin
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Location/origin
     * @return string origin
     */
    get origin(): string {
        return this._origin;
    }

    /**
     * Setter for origin
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Location/origin
     * @param origin
     */
    set origin(origin: string) {
        this._origin = origin;
        transfer(this._document, [TransferrableMutationType.LOCATION, GetOrSet.SET, store(this.toString())]);
    }

    /**
     * Getter for protocol
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Location/protocol
     * @return string protocol
     */
    get protocol(): string {
        return this._protocol;
    }

    /**
     * Setter for protocol
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Location/protocol
     * @param protocol
     */
    set protocol(protocol: string) {
        this._protocol = protocol;
        transfer(this._document, [TransferrableMutationType.LOCATION, GetOrSet.SET, store(this.toString())]);
    }

    /**
     * Getter for host
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Location/host
     * @return string host
     */
    get host(): string {
        return this._host;
    }

    /**
     * Setter for host
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Location/host
     * @param host
     */
    set host(host: string) {
        this._host = host;
        transfer(this._document, [TransferrableMutationType.LOCATION, GetOrSet.SET, store(this.toString())]);
    }

    /**
     * Getter for hostname
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Location/hostname
     * @return string hostname
     */
    get hostname(): string {
        return this._hostname;
    }

    /**
     * Setter for hostname
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Location/hostname
     * @param hostname
     */
    set hostname(hostname: string) {
        this._hostname = hostname;
        transfer(this._document, [TransferrableMutationType.LOCATION, GetOrSet.SET, store(this.toString())]);
    }

    /**
     * Getter for port
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Location/port
     * @return string port
     */
    get port(): string {
        return this._port;
    }

    /**
     * Setter for port
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Location/port
     * @param port
     */
    set port(port: string) {
        this._port = port;
        transfer(this._document, [TransferrableMutationType.LOCATION, GetOrSet.SET, store(this.toString())]);
    }

    /**
     * Getter for pathname
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Location/pathname
     * @return string pathname
     */
    get pathname(): string {
        return this._pathname;
    }

    /**
     * Setter for pathname
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Location/pathname
     * @param pathname
     */
    set pathname(pathname: string) {
        this._pathname = pathname;
        transfer(this._document, [TransferrableMutationType.LOCATION, GetOrSet.SET, store(this.toString())]);
    }

    /**
     * Getter for search
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Location/search
     * @return string search
     */
    get search(): string {
        return this._search;
    }

    /**
     * Setter for search
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Location/search
     * @param search
     */
    set search(search: string) {
        this._search = search;
        transfer(this._document, [TransferrableMutationType.LOCATION, GetOrSet.SET, store(this.toString())]);
    }

    /**
     * Getter for hash
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Location/hash
     * @return string hash
     */
    get hash(): string {
        return this._hash;
    }

    /**
     * Setter for hash
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Location/hash
     * @param hash
     */
    set hash(hash: string) {
        this._hash = hash;
        transfer(this._document, [TransferrableMutationType.LOCATION, GetOrSet.SET, store(this.toString())]);
    }

    /**
     * Loads the resource at the URL provided in parameter.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Location/assign
     * @param url URL
     */
    public assign(url: string): void {

    }


    /**
     * Redirects to the provided URL.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Location/replace
     * @param url URL
     */
    public replace(url: string): void {

    }

    /**
     * Reloads the current URL, like the Refresh button.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Location/reload
     */
    public reload(): void {

    }

    /**
     * Returns a string containing the whole URL.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Location/toString
     * @return string URL
     */
    public toString(): string {
        return this.href;
    }
}
