class VideoHandler {
    private video:HTMLVideoElement;
    private canvas:HTMLCanvasElement[] = [];
    private contexts:CanvasRenderingContext2D[] = [];

    private defaultSize:number = 405;
    private scaledSize:number = 187;
    private thumbPosition = [{left: 360, top: 146}, {left: 91, top: 146}];

    public bindVideo():void {
        window.addEventListener("DOMContentLoaded", () => {
            for(var i = 0; i < 2; i++) {
                this.canvas[i] = <HTMLCanvasElement>document.getElementById("thumb" + i);
                this.contexts[i] = this.canvas[i].getContext("2d");
            }
            this.video = <HTMLVideoElement>document.getElementById("video");
            navigator.webkitGetUserMedia({video: true}, (stream) => {
                this.video.src = window.webkitURL.createObjectURL(stream);
                this.video.play();
            }, (error:any) =>{
                console.log("Video capture error: ", error.code);
            });
        }, false);
    }

    public snapPlayer(order) {
        this.contexts[order].drawImage(this.video, this.thumbPosition[order].left,
            this.thumbPosition[order].top,
            this.scaledSize, this.scaledSize, 0, 0,
            this.defaultSize, this.defaultSize);
        return this.canvas[order].toDataURL("image/jpeg");
    }
}
