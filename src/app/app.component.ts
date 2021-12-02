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
    /* If local storage exists get data from local storage
      otherwise set default data */
    if (localStorage.getItem('title') || localStorage.getItem('date')) {
      this.title = localStorage.getItem('title') as string
      this.eventDate = localStorage.getItem('date') as string
    } else {
      localStorage.setItem('title', 'New Years Eve')
      localStorage.setItem('date', '2021-12-31')
    }

    // Called once before interval to not wait for 1 second before showing countdown and calculating font size
    this.getCountdownFromDate()
    this.calculateFontSize()

    setInterval(() => {
      this.getCountdownFromDate()
      // Calculating font size every second because countdown can go from 2 digits to 1 and vice verca
      this.calculateFontSize()
    }, 1000)
  }

  setTitle(inputTitle: string) {
    // Limit input to 100 chars
    if (inputTitle.length <= 100) {
      this.title = inputTitle
      localStorage.setItem('title', this.title)
      this.calculateFontSize()
    }
  }

  setDate(inputDate: string) {
    // Limit input to date format length (YYYY-MM-DD)
    if (inputDate.length <= 10) {
      this.eventDate = inputDate
      localStorage.setItem('date', this.eventDate)
      this.calculateFontSize()
    }
  }

  /**
   * Calculates time between user input date and time set to midnight 00:00 (default)
   * and the date and time right now. Then displays sets countdown value
   */
  getCountdownFromDate() {
    // Special case for iOS since it seems to change month-day order in the string
    const dateRegexValidationIOS =
      /(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|[1][0-2])\/[0-9]+,\s[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]{1,3})?/i
    const defaultDateRegexValidation =
      /(0?[1-9]|[1][0-2])\/(0?[1-9]|[12][0-9]|3[01])\/[0-9]+,\s[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]{1,3})?/i

    const format = 'short'
    const myDate = new Date(`${this.eventDate}T00:00:00`)
    const locale = 'en-US'

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
   * Expands child span width to parent div width by increasing
   * font size of childs text by 2px and after by 0.01px until the
   * width is the same
   */
  calculateFontSize() {
    setTimeout(() => {
      const parent =
        document.querySelectorAll<HTMLElement>('.titleContainer')[0]
      const children = parent.querySelectorAll<HTMLElement>('span')

      let fontSizePx = 0

      children.forEach((child) => {
        // If initial value does not exist (first render) set inital value to 300px
        // otherwise transform the font vw to px for further calculations
        if (!child.style.fontSize) {
          child.style.fontSize = '300px'
        } else {
          fontSizePx =
            (document.documentElement.clientWidth *
              parseFloat(child.style.fontSize)) /
            100

          child.style.fontSize = `${fontSizePx}px`
        }

        if (parent.offsetWidth && child.offsetWidth) {
          // First two while checks get the fontSize close to how big it needs to be without caring too much for accuracy
          while (parent.offsetWidth > child.offsetWidth) {
            child.style.fontSize = `${parseFloat(child.style.fontSize) + 2}px`
          }

          while (parent.offsetWidth < child.offsetWidth) {
            child.style.fontSize = `${parseFloat(child.style.fontSize) - 2}px`
          }

          // Second two while checks get the fontSize to max width of container with really good accuracy
          while (parent.offsetWidth > child.offsetWidth) {
            child.style.fontSize = `${
              parseFloat(child.style.fontSize) + 0.01
            }px`
          }

          while (parent.offsetWidth < child.offsetWidth) {
            child.style.fontSize = `${
              parseFloat(child.style.fontSize) - 0.01
            }px`
          }

          // Transform font size from px to vw
          const fontSizeVw =
            (100 * parseFloat(child.style.fontSize)) /
            document.documentElement.clientWidth

          child.style.fontSize = `${fontSizeVw}vw`
        }
      })
    }, 10)
    clearTimeout()
  }
}
