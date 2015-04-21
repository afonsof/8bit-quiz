class VideoHandler {
    private video:HTMLVideoElement;
    private canvas:HTMLCanvasElement[] = [];
    private contexts:CanvasRenderingContext2D[] = [];

    private defaultSize:number = 405;
    private videoSize:number = 187;
    private thumbPosition = [{left: 360, top: 146}, {left: 91, top: 146}];

    public bindVideo():void {
        window.addEventListener("DOMContentLoaded", () => {
            for(var i = 0; i < 2; i++) {
                this.canvas[i] = <HTMLCanvasElement>document.getElementById("thumb" + i);
                this.contexts[i] = this.canvas[i].getContext("2d");
            }
            this.video = <HTMLVideoElement>document.getElementById("video");
            navigator.webkitGetUserMedia({video: true}, (stream) => {
                this.video.src = window.URL.createObjectURL(stream);
                this.video.play();
            }, (error:any) =>{
                console.log("Video capture error: ", error.code);
            });
        }, false);
    }

    public snapPlayer(order) {
        this.contexts[order].drawImage(this.video, this.thumbPosition[order].left,
            this.thumbPosition[order].top,
            this.videoSize, this.videoSize, 0, 0,
            this.defaultSize, this.defaultSize);

        VideoHandler.render(this.contexts[order], this.defaultSize, this.defaultSize, 8);

        return this.canvas[order].toDataURL("image/jpeg");
    }

    private static render(context, w, h, pixelSize:number) {
        var imgData = context.getImageData(0, 0, w, h).data;
        context.clearRect(0, 0, w, h);
        var cols = w / pixelSize + 1;
        var rows = h / pixelSize + 1;
        var row, col, x, y, pixelIndex, red, green, blue;

        for (row = 0; row < rows; row++) {
            y = row * pixelSize;

            for (col = 0; col < cols; col++) {
                x = col * pixelSize;
                pixelIndex = ( x + y * w ) * 4;

                red = imgData[pixelIndex + 0];
                green = imgData[pixelIndex + 1];
                blue = imgData[pixelIndex + 2];

                red = red - (red % 16);
                green = green - (green % 16);
                blue = blue - (blue % 16);

                context.fillStyle = 'rgb(' + red + ',' + green + ',' + blue + ')';
                context.fillRect(x, y, pixelSize, pixelSize);
            }
        }
    }
}
