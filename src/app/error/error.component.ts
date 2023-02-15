import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

@Component({
  selector: 'error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
})
export class ErrorComponent implements OnInit {
  run: number = 0

  decisionElement: any

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.decisionElement = document.querySelector('#decision')
    this.decisionElement.setAttribute('style', 'display: none')
  }

  cafe(): void {
    if (this.run != 0) return
    this.run++
    let chat = document.querySelector('#chat')
    let delay: number = 0

    let time = document.createElement('span')
    let date = new Date()
    time.classList.add('time')
    time.innerHTML =
      date.getHours() +
      ':' +
      (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
    chat?.appendChild(time)

    let cup = document.querySelector('#coding-cafe')
    let smoke = document.querySelector('.smoke')
    cup?.setAttribute('style', 'animation: take-cup 3s ease-in-out 1;')
    setTimeout(() => {
      smoke?.setAttribute('style', 'display: none;')
    }, 1500)
    setTimeout(() => {
      cup?.setAttribute('style', 'animation: none;')
    }, 3000)

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
    setTimeout(() => {
      this.decisionElement.setAttribute('style', 'display: flex')
    }, delay)
  }
  decision(value: string) {
    if (this.run != 1) return
    this.decisionElement.setAttribute('style', 'display: none')
    this.run++
    let chat = document.querySelector('#chat')
    let delay: number = 0

    let time = document.createElement('span')
    let date = new Date()
    time.classList.add('time')
    time.innerHTML =
      date.getHours() +
      ':' +
      (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
    chat?.appendChild(time)

    let cup = document.querySelector('#coding-cafe')
    let smoke = document.querySelector('.smoke')
    cup?.setAttribute('style', 'animation: take-cup 3s ease-in-out 1;')

    let dialog: any = {
      user: ['Okay, I`ll go to the store.'],
      messages: ['Really?', 'Thank you!'],
      nothing: [
        'Em... I have a question...',
        'Why my cup is still empty?',
        "You didn't buy me a new cup, did you?",
        'You just took my cup and gave it back to me.',
        'LIKE SECOND TIME!',
        'You are so mean...',
        'Get out of here!',
        'QUIT!',
      ],
      matik: [
        'But...',
        'I don`t actually like a Tea, but one of our Devs is a Tea lover.',
        'I`ll take it to <a href="https://wlo.link/@matik" target="_blank">Matik</a>, a front-end developer.',
        'He will love it!',
      ],
      houtaroum: [
        'But...',
        'I don`t actually like a Coffee, but one of our Devs is a Coffee lover.',
        'I`ll take it to <a href="https://github.com/HoutarouM" target="_blank">HoutarouM</a>, a back-end developer.',
        'He will love it!',
      ],
    }
    let messageBlockDivs: any[] = []
    for (let i = 0; i < 3; i++) {
      messageBlockDivs[i] = document.createElement('div')
      messageBlockDivs[i].classList.add('messages')
      chat?.appendChild(messageBlockDivs[i])
    }
    messageBlock(dialog.user, messageBlockDivs[0], ['user'])
    messageBlock(dialog.messages, messageBlockDivs[1], [])
    messageBlock(dialog[value], messageBlockDivs[2], ['nothing'])

    if (value != 'nothing') {
      setTimeout(() => {
        smoke?.setAttribute('style', 'display: block;')
      }, 1500)
    }

    function messageBlock(
      thisDialog: string[],
      messageBlock: any,
      messageClasses: string[]
    ) {
      for (let message of thisDialog) {
        let msg: DialogMessage = new DialogMessage(message, [
          'message',
          ...messageClasses,
        ])
        setTimeout(
          () => messageBlock.appendChild(msg.element),
          delay + msg.delay
        )
        delay += msg.delay
      }
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
