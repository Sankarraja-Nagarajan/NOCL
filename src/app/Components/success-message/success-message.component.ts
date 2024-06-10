import { Component, OnInit } from "@angular/core";

@Component({
  selector: "ngx-success-message",
  templateUrl: "./success-message.component.html",
  styleUrls: ["./success-message.component.scss"],
})
export class SuccessMessageComponent implements OnInit {
  confettis: { style: any }[] = [];

  constructor() {}

  ngOnInit(): void {
    this.generateConfettis(200); // Generate 100 confetti elements
  }

  generateConfettis(count: number): void {
    this.confettis = Array.from({ length: count }, () => ({
      style: {
        left: `${Math.random() * 100}vw`,
        top: `${Math.random() * -50}vh`,
        animationDelay: `${Math.random() * 4}s`,
        animationDuration: `${Math.random() * 3 + 2}s`,
        backgroundColor: this.getRandomColor(),
        width: `${Math.random() * 10 + 5}px`,
        height: `${Math.random() * 20 + 10}px`,
      },
    }));
  }

  getRandomColor(): string {
    const colors = ['#ff0', '#f00', '#0f0', '#00f', '#0ff', '#f0f', '#ffa500'];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}
