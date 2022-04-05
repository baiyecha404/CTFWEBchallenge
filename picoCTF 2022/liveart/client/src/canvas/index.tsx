import React from "react";

export class CanvasManager {
    private canvas;
    private color;
    private baseWidth;
    private scale;

    private mouseDown = false;

    private ctx;
    private image;

    private mousePosition;
    private isErasing;
    private changeHandlers;

    constructor(canvas: HTMLCanvasElement, color: number, baseWidth = 48, scale = 8) {
        this.canvas = canvas;
        this.color = color;
        this.baseWidth = baseWidth;
        this.scale = scale;

        this.ctx = canvas.getContext("2d")!;

        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.draw = this.draw.bind(this);

        canvas.addEventListener("mousemove", this.onMouseMove);
        canvas.addEventListener("mousedown", this.onMouseDown);
        canvas.addEventListener("mouseup", this.onMouseUp);
        canvas.addEventListener("mouseleave", this.onMouseUp);

        this.mousePosition = [0, 0] as [x: number, y: number];
        this.isErasing = false;
        this.changeHandlers = new Set<(data: number[][]) => void>();

        this.canvas.width = baseWidth * scale;
        this.canvas.height = baseWidth * scale;
        this.ctx.imageSmoothingEnabled = false;
        requestAnimationFrame(this.draw);

        this.image = Array.from(new Array(baseWidth), () =>
            Array.from(new Array(baseWidth), () =>
                0xFFFFFF
            )
        );
    }

    public update(data: number[][]) {
        if (this.image === data) {
            return;
        }

        this.image = data;
        this.triggerChange();
    }

    public on(event: "change", cb: (data: number[][]) => void): () => void {
        this.changeHandlers.add(cb);

        return () => this.changeHandlers.delete(cb);
    }

    public setColor(color: number) {
        this.color = color;
    }

    public destroy() {
        this.canvas.removeEventListener("mousemove", this.onMouseMove);
        this.canvas.removeEventListener("mousedown", this.onMouseDown);
        this.canvas.removeEventListener("mouseup", this.onMouseUp);
        this.canvas.removeEventListener("mouseleave", this.onMouseUp);

        this.changeHandlers = new Set<(data: number[][]) => void>();
    }

    protected onMouseMove(e: MouseEvent) {
        const position = [Math.floor(e.offsetX / this.scale), Math.floor(e.offsetY / this.scale)] as [x: number, y: number];

        if (position[0] < 0 || position[0] >= this.baseWidth || position[1] < 0 || position[1] >= this.baseWidth) {
            return;
        }

        this.mousePosition = position;
        this.isErasing = e.shiftKey;

        const color = this.isErasing ? 0xFFFFFF : this.color;

        if (this.mouseDown && this.image[position[1]][position[0]] !== color) {
            this.image[position[1]][position[0]] = color;
            this.triggerChange();
        }
    }

    protected onMouseDown(e: MouseEvent) {
        this.mouseDown = true;
        this.onMouseMove(e);
    }

    protected onMouseUp(e: MouseEvent) {
        this.mouseDown = false;
    }

    protected draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let x = 0; x < this.baseWidth; x++) {
            for (let y = 0; y < this.baseWidth; y++) {
                this.ctx.fillStyle = `#${this.image[y][x].toString(16).padStart(6, "0")}`;
                this.ctx.fillRect(x * this.scale, y * this.scale, this.scale, this.scale);
            }
        }

        const color = this.isErasing ? 0xFFFFFF : this.color;
        this.ctx.fillStyle = `#${color.toString(16).padStart(6, "0")}`;
        this.ctx.fillRect(this.mousePosition[0] * this.scale, this.mousePosition[1] * this.scale, this.scale, this.scale);

        requestAnimationFrame(this.draw);
    }

    protected triggerChange() {
        for (const cb of this.changeHandlers) {
            cb(this.image);
        }
    }
}