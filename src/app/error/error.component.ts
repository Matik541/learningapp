import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

@Component({
  selector: 'error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
})
export class ErrorComponent implements OnInit {
  run: number = 0

  constructor(private router: Router) {}

  ngOnInit(): void {}

  cafe(): void {
    if (this.run % 2 == 1) return
    if (this.run == 0) this.run = 1
    let chat = document.querySelector('#chat')
    let delay: number = 0

    let time = document.createElement('span')
    let date = new Date()
    time.classList.add('time')
    time.innerHTML =
      date.getHours() +
      ':' +
      (date.getMinutes() < 0 ? '0' + date.getMinutes() : date.getMinutes())
    chat?.appendChild(time)

    let dialog: any = {
      messages: [
        'Hey!',
        'What are you doing, why did you take my cup?',
        'Why did you drink it all...',
        'It was my last cup...',
        'It was still hot...',
        'Now I have to go to buy another one...',
        'And I have to wait for it to cool down...',
        'Do me a favor, go to the store and buy me a ',
        'Please?',
      ],
    }
    let messageBlock = document.createElement('div')
    messageBlock.classList.add('messages')
    chat?.appendChild(messageBlock)
    for (let message of dialog.messages) {
      let msg: DialogMessage = new DialogMessage(message, ['message'])
      setTimeout(() => messageBlock.appendChild(msg.element), delay + msg.delay)
      delay += msg.delay
    }
    setTimeout(() => {}, delay)
  }
  secondDialog(): void {
    let chat = document.querySelector('#chat')
    let dialog: any = {
      messages: ['Oh, are you going to the store?'],
      bad: [
        'Em... I have a question...',
        'Why my cup is still empty?',
        "You didn't buy me a new cup, did you?",
        'You just took my cup and gave it back to me.',
        'LIKE SECOND TIME!',
        'You are so mean...',
        'Get out of here!',
        'QUIT',
      ],
      good: ['I really appreciate it!', 'Thank you so much!'],
    }
  }
}
class DialogMessage {
  delay: number = 0
  element: HTMLElement = document.createElement('div')
  constructor(message: string, classes?: string[]) {
    this.element.innerHTML = message
    this.element.classList.add('message')
    if (classes) classes.forEach((c) => this.element.classList.add(c))
    this.delay = message.length * 25 + 500
  }

  pushClass(className: string) {
    this.element.classList.add(className)
  }
}
