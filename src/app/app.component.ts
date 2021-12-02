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
    /* If local storage exists fetch data from local storage
      otherwise set default data */
    if (localStorage.getItem('title') || localStorage.getItem('date')) {
      this.title = localStorage.getItem('title') as string
      this.eventDate = localStorage.getItem('date') as string
    } else {
      localStorage.setItem('title', 'New Years Eve')
      localStorage.setItem('date', '2021-12-31')
    }

    /* Called once before interval to not wait for 1 second before showing countdown */
    this.getCountdownFromDate()

    setInterval(() => {
      this.getCountdownFromDate()
    }, 1000)
  }

  ngAfterContentInit() {
    this.calculateTitleFontSize()
  }

  setTitle(inputTitle: string) {
    this.title = inputTitle
    localStorage.setItem('title', this.title)

    this.calculateTitleFontSize()
  }

  setDate(inputDate: string) {
    this.eventDate = inputDate
    localStorage.setItem('date', this.eventDate)
  }

  /**
   * Calculates time between user input date with time set to midnight 00:00
   * and the date and time right now. Then displays countdown
   */
  getCountdownFromDate() {
    const dateRegexValidationIOS =
      /(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|[1][0-2])\/[0-9]+,\s[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]{1,3})?/i
    const defaultDateRegexValidation =
      /(0?[1-9]|[1][0-2])\/(0?[1-9]|[12][0-9]|3[01])\/[0-9]+,\s[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]{1,3})?/i

    const year = parseInt(this.eventDate.substring(0, 4))

    const month = parseInt(this.eventDate.substring(5, 7))
    const day = parseInt(this.eventDate.substring(8, 10))
    console.log(year, month, day)

    const format = 'short'
    const myDate = new Date(`${this.eventDate}T00:00:00`)
    const locale = 'en-US'
    console.log(myDate.toLocaleString())

    if (
      dateRegexValidationIOS.test(myDate.toLocaleString()) ||
      defaultDateRegexValidation.test(myDate.toLocaleString())
    ) {
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

  /**
   * Expands child width to parent width by increasing font size of childs text
   * by 0.5px until the width is the same
   */
  calculateTitleFontSize() {
    setTimeout(() => {
      const parent =
        document.querySelectorAll<HTMLElement>('.titleContainer')[0]
      const children = parent.querySelectorAll<HTMLElement>('span')
      children[0].style.fontSize = '1px'
      children[1].style.fontSize = '1px'
      children.forEach((child) => {
        if (parent.offsetWidth && child.offsetWidth) {
          while (parent.offsetWidth > child.offsetWidth) {
            child.style.fontSize = `${parseFloat(child.style.fontSize) + 2}px`
          }

          while (parent.offsetWidth < child.offsetWidth) {
            child.style.fontSize = `${parseFloat(child.style.fontSize) - 2}px`
          }

          while (parent.offsetWidth > child.offsetWidth) {
            child.style.fontSize = `${parseFloat(child.style.fontSize) + 0.1}px`
          }

          const fontSize =
            (100 * parseFloat(child.style.fontSize)) /
            document.documentElement.clientWidth

          child.style.fontSize = `${fontSize}vw`
        }
      })
    }, 10)
  }
}
