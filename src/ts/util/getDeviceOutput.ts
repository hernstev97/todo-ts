import { DeviceOutputType } from "../types/DeviceOutputType";

export const getDeviceOutput = (): DeviceOutputType => {
    const isMobile = window.innerWidth <= 720;
    const isTablet = window.innerWidth > 720 && window.innerWidth <= 1280;

    if (isMobile)
        return 'mobile';
    if (isTablet)
        return 'tablet';

    return 'desktop';
}