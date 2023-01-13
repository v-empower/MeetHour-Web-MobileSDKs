/**
 * Returns the complete room name
 *
 * @param {string} roomName
 * @param {string} tenant
 * @returns {string} the complete room name
 */
export const getRoomName = (
        roomName: string,
        tenant?: string
): string => {
    if (tenant) {
        return `${tenant}/${roomName}`;
    }

    return roomName;
};

/**
 * Returns the appId or tenant value
 *
 * @param {string} roomName
 * @returns {string|undefined}
 */
export const getAppId = (roomName: string): string | undefined => {
    const roomParts = roomName.split('/');

    if (roomParts.length <= 1) {
        return;
    }

    return roomParts[0];
}

let instancesCounter = 0;

/**
 * Generates an unique id
 * @param {string} prefix
 * @returns {string} the component id
 */
export const generateComponentId = (
        prefix: string
): string => `${prefix}-${instancesCounter++}`;
