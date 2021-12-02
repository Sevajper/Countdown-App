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
  dateRegexValidation =
    /[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]{1,3})?Z/i

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
    this.getCountdownFromDate(
      this.dateRegexValidation,
      'short',
      this.eventDate,
      'en-US',
    )
    this.adjustFontSize()

    // Called every second to display countdown and font size properly
    setInterval(() => {
      this.getCountdownFromDate(
        this.dateRegexValidation,
        'short',
        this.eventDate,
        'en-US',
      )
    }, 1000)
  }

  setTitle(inputTitle: string) {
    // Limit input to 100 chars
    if (inputTitle.length <= 100) {
      this.title = inputTitle
      localStorage.setItem('title', this.title)
      this.adjustFontSize()
    }
  }

  setDate(inputDate: string) {
    // Limit input to date format length (YYYY-MM-DD)
    if (inputDate.length <= 10) {
      this.eventDate = inputDate
      localStorage.setItem('date', this.eventDate)
      this.getCountdownFromDate(
        this.dateRegexValidation,
        'short',
        this.eventDate,
        'en-US',
      )
    }
  }

  /**
   * Calculates time between user input date and time and the date and time right now.
   * Default time set for user input is midnight 00:00. Then sets countdown value
   */
  getCountdownFromDate(
    regex: RegExp,
    format: string,
    date: string,
    locale: string,
  ) {
    const userDate = new Date(`${date}T00:00:00`)

    if (
      userDate.toString() !== 'Invalid Date' &&
      regex.test(userDate.toISOString())
    ) {
      const formattedFutureDate = new Date(
        formatDate(userDate.toISOString(), format, locale),
      ).getTime()

      const currentDate = new Date().getTime()
      const timeDifferenceToGoal = formattedFutureDate - currentDate

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

        this.adjustFontSize()
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
   * width is correct
   */
  adjustFontSize() {
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
          this.calculateFontSize(parent, child)
        }

        // Transform font size from px to vw
        const fontSizeVw =
          (100 * parseFloat(child.style.fontSize)) /
          document.documentElement.clientWidth

        // Set final font size of child element
        child.style.fontSize = `${fontSizeVw}vw`
      })
    }, 50)
    clearTimeout()
  }

  calculateFontSize(parent: HTMLElement, child: HTMLElement) {
    let loopBreak = 0
    // First two while checks get the fontSize close to how big it needs to be without caring too much for accuracy
    while (parent.offsetWidth > child.offsetWidth) {
      child.style.fontSize = `${parseFloat(child.style.fontSize) + 2}px`
      loopBreak++
      if (loopBreak > 5000) {
        break
      }
    }

    while (parent.offsetWidth < child.offsetWidth) {
      child.style.fontSize = `${parseFloat(child.style.fontSize) - 2}px`
      loopBreak++
      if (loopBreak > 5000) {
        break
      }
    }

    /* Second two while checks get the fontSize to max width of container with really good accuracy
     and a bit more heavy on performance */
    while (parent.offsetWidth > child.offsetWidth) {
      child.style.fontSize = `${parseFloat(child.style.fontSize) + 0.01}px`
      loopBreak++
      if (loopBreak > 5000) {
        break
      }
    }

    while (parent.offsetWidth < child.offsetWidth) {
      child.style.fontSize = `${parseFloat(child.style.fontSize) - 0.01}px`
      loopBreak++
      if (loopBreak > 5000) {
        break
      }
    }
  }
}
