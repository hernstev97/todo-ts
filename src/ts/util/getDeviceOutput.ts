import { DeviceOutputType } from "../types/DeviceOutputType";

export default function getDeviceOutput(windowWidth: number): DeviceOutputType {
    const isMobile = windowWidth <= 720;
    const isTablet = windowWidth > 720 && windowWidth <= 1280;

    if (isMobile)
        return 'mobile';
    if (isTablet)
        return 'tablet';

    return 'desktop';
}

module.exports = getDeviceOutput;