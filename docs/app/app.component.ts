import { Component, OnInit } from '@angular/core'
import { formatDate } from '@angular/common'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'New Years Eve' // Default title
  eventDate = '2021-12-31' // Default date
  countdown = ''

  ngOnInit() {
    if (localStorage.getItem('title') || localStorage.getItem('date')) {
      this.title = localStorage.getItem('title') as string
      this.eventDate = localStorage.getItem('date') as string
    } else {
      localStorage.setItem('title', 'New Years Eve')
      localStorage.setItem('date', '2021-12-31')
    }
    this.getCountdown()
  }

  ngAfterViewInit() {
    setInterval(() => {
      this.getCountdown()
    }, 1000)
  }

  ngAfterViewChecked() {
    this.calculateTitleFontSize()
  }

  setTitle(inputTitle: string) {
    this.title = inputTitle
    localStorage.setItem('title', this.title)
  }

  setDate(inputDate: string) {
    this.eventDate = inputDate
    localStorage.setItem('date', this.eventDate)
  }

  getElementFontSize(element: Element) {
    return window.getComputedStyle(element, null).getPropertyValue('font-size')
  }

  getCountdown() {
    const dateRegexValidation =
      /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01]) 00:00:00$/

    const format = 'short'
    const myDate = `${this.eventDate} 00:00:00`
    const locale = 'en-US'

    if (dateRegexValidation.test(myDate)) {
      const formattedFutureDate = new Date(
        formatDate(myDate, format, locale),
      ).getTime()
      const currentTime = new Date().getTime()
      const timeDifferenceToGoal = formattedFutureDate - currentTime

      if (timeDifferenceToGoal > 0) {
        const days = Math.floor(timeDifferenceToGoal / (1000 * 60 * 60 * 24))
        const hours = Math.floor(
          (timeDifferenceToGoal % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        )
        const minutes = Math.floor(
          (timeDifferenceToGoal % (1000 * 60 * 60)) / (1000 * 60),
        )
        const seconds = Math.floor((timeDifferenceToGoal % (1000 * 60)) / 1000)

        this.countdown = `${days} days, ${hours}h, ${minutes}m, ${seconds}s`
      } else {
        this.countdown = `Invalid date`
      }
    } else {
      this.countdown = `Invalid date format`
    }
  }

  calculateTitleFontSize() {
    const parent = document.querySelectorAll<HTMLElement>('.titleContainer')[0]
    const children = parent.querySelectorAll<HTMLElement>('span')

    children.forEach((child) => {
      child.style.fontSize = '40px'

      if (parent.offsetWidth && child.offsetWidth) {
        while (parent.offsetWidth > child.offsetWidth) {
          child.style.fontSize = `${parseInt(child.style.fontSize) + 1}px`
        }

        while (parent.offsetWidth < child.offsetWidth) {
          child.style.fontSize = `${parseInt(child.style.fontSize) - 1}px`
        }

        const fontSize =
          (100 * parseInt(child.style.fontSize)) /
          document.documentElement.clientWidth

        child.style.fontSize = `${fontSize}vw`
      }
    })
  }
}
