import { API_BASE_URL, API_RELEASE, DEFAULT_DOMAIN } from './constants';
import { MeetHourExternalAPI } from './types';

const loadExternalApi = async (
        domain: string,
        apiKey: string,
        release?: string
): Promise<MeetHourExternalAPI> => new Promise((resolve, reject) => {
    if (window.MeetHourExternalAPI) {
        return resolve(window.MeetHourExternalAPI);
    }

    const script: HTMLScriptElement = document.createElement('script');
    const APIURL: string = domain ? domain : API_BASE_URL;
    const releaseParam: string = release ? release : API_RELEASE;

    script.async = true;
    script.src = `https:/${APIURL}/libs/${releaseParam}/external_api.min.js?v=${Date.now()}&apiKey=${apiKey}`;
    script.onload = () => resolve(window.MeetHourExternalAPI);
    script.onerror = () => reject(new Error(`Script load error: ${script.src}`));
    document.head.appendChild(script as Node);
});


let scriptPromise: Promise<MeetHourExternalAPI>;

/**
 * Injects the external_api.js script for the corresponding domain in DOM
 * and resolves with either the `MeetHourExternalAPI` class definition or an error.
 *
 * Only the first script will be injected, therefore avoid using multiple instances
 * with mixed domains and release version at the same time.
 *
 * @param {string} domain - The domain of the external API
 * @param {string} apiKey - API Key requried to load External API.
 * @param {string} release - The Meet Hour release. Expected format: 'v2.4.5'
 * @returns {Promise<MeetHourExternalAPI>} - The MeetHourExternalAPI or an error
 */
export const fetchExternalApi = (
        domain: string = DEFAULT_DOMAIN,
        apiKey: string,
        release?: string,
): Promise<MeetHourExternalAPI> => {
    if (scriptPromise) {
        return scriptPromise;
    }

    scriptPromise = loadExternalApi(domain, apiKey, release);

    return scriptPromise;
};
