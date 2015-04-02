interface Navigator {
    getUserMedia(
        options: { video?: boolean; audio?: boolean; },
        success: (stream: any) => void,
        error?: (error: string) => void
    ) : void;

    webkitGetUserMedia(
        options: { video?: boolean; audio?: boolean; },
        success: (stream: any) => void,
        error?: (error: string) => void
    ) : void;

    mozGetUserMedia(
        options: { video?: boolean; audio?: boolean; },
        success: (stream: any) => void,
        error?: (error: string) => void
    ) : void;
}

interface Window{
    URL: Url;
    webkitURL: Url;
}

interface Url{
    createObjectURL(stream);
}

