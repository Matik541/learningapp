import { Component, OnInit } from '@angular/core'
import { MatSnackBar } from '@angular/material/snack-bar'

@Component({
  selector: 'social-share',
  templateUrl: './social-share.component.html',
  styleUrls: ['./social-share.component.scss'],
})
export class SocialShareComponent implements OnInit {
  shareMethods: {
    icon: string
    name: string
    type: string
    avable: boolean
    color: string
  }[] = [
    {
      icon: 'facebook',
      name: 'Facebook',
      type: 'font',
      avable: true,
      color: '#5880d0',
    },
    {
      icon: 'twitter',
      name: 'Twitter',
      type: 'svg',
      avable: true,
      color: '#1da1f2',
    },
    {
      icon: 'whatsapp',
      name: 'WhatsApp',
      type: 'svg',
      avable: true,
      color: '#25d366',
    },
    {
      icon: 'telegram',
      name: 'Telegram',
      type: 'font',
      avable: true,
      color: '#0088cc',
    },
    {
      icon: 'email',
      name: 'Email',
      type: 'font',
      avable: true,
      color: 'var(--my-accent)',
    },
    {
      icon: 'link',
      name: 'Copy link',
      type: 'font',
      avable: true,
      color: 'var(--bs-info)',
    },
  ]

  constructor(private snackBar: MatSnackBar) {}

  ngOnInit(): void {}

  share(method: string): void {
    console.log(method)
    let url = window.location.href
    switch (method) {
      case 'facebook':
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${url}`,
          'facebook-share-dialog',
          'width=800,height=600'
        )
        break
      case 'twitter':
        window.open(
          `https://twitter.com/intent/tweet?url=${url}`,
          'twitter-share-dialog',
          'width=800,height=600'
        )
        break
      case 'whatsapp':
        window.open(
          `https://wa.me/?text=${url}`,
          'whatsapp-share-dialog',
          'width=800,height=600'
        )
        break
      case 'telegram':
        window.open(
          `https://t.me/share/url?url=${url}`,
          'telegram-share-dialog',
          'width=800,height=600'
        )
        break
      case 'email':
        window.open(`mailto:?subject=Check this out!&body=${url}`)
        break
      case 'link':
        this.snackBar.open('Link copied to clipboard', 'OK', {
          duration: 2000,
        })
        navigator.clipboard.writeText(url)
        break
      default:
        this.snackBar.open(
          'This method is not avable yet<br>Link copied to clipboard',
          'OK',
          {
            duration: 2000,
          }
        )
        navigator.clipboard.writeText(url)

        break
    }
  }
}
