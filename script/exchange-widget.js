(function () {
  let widgetBox
  const body = document.querySelector('body')
  const boxName = document.currentScript.getAttribute('widgetBoxName')
  console.log(boxName)
  if(boxName){
    widgetBox = document.getElementById(boxName)
  }
  else {
    widgetBox = document.getElementById('swapzoneExchangeWidget')
  }

  if (widgetBox) {
    widgetBox.setAttribute('style', 'overflow: hidden; margin: 0 auto; max-width: 483px; width: 100%; min-width: 310px')

    const referralId = widgetBox.dataset.refid ?? widgetBox.dataset.refId ?? widgetBox.dataset.referralId
    const compact = !!widgetBox.dataset.compact
    const logo = !!widgetBox.dataset.logo
    const mode = widgetBox.dataset.mode
    const from = widgetBox.dataset.from
    const to = widgetBox.dataset.to
    const theme = widgetBox.dataset.theme

    let iframeExchangeHeight = compact ? 392 : 710
    let iframeExchangeWindowWidth = 784
    let iframeExchangeWindowHeight = 855

    if (window.screen.width < 530) {
      iframeExchangeHeight = compact ? 370 : 700

      iframeExchangeWindowWidth = 360
      iframeExchangeWindowHeight = 890
    }

    const query = new URLSearchParams()
    if (referralId) {
      query.append('referralId', referralId)
    } else {
      query.append('referralId', null)
    }

    if (compact) {
      query.append('compact', String(compact))
    }

    if (logo) {
      iframeExchangeHeight += 40
      query.append('logo', String(logo))
    }

    if (mode) {
      query.append('mode', mode)
    }

    if (from) {
      query.append('from', from)
    }

    if (to) {
      query.append('to', to)
    }

    if (theme) {
      query.append('theme', theme)
    }

    const queryString = query.toString()
    const url = 'https://swapzone.io'

    const appendQuery = queryString ? `?${queryString}` : ''
    const iframeSrc = `${url}/exchange-widget${appendQuery}`

      widgetBox.insertAdjacentHTML(
      'afterbegin',
      `<iframe
      frameborder="0"
      data-src="${iframeSrc}"
      height="${iframeExchangeHeight}"
      style="position: relative; width: inherit; min-width: 310px; border-radius: 8px;"
      name="swapzoneExchangeWidget"
      id="swapzoneWidgetFrame"></iframe>`,
    )

    const widget = document.getElementById('swapzoneWidgetFrame')
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          observer.unobserve(widget)
          const ival = setInterval(() => {
            const iframe = entry.target
            if (iframe) {
              clearInterval(ival)
              iframe.src = iframe.dataset.src
            }
          }, 100)
        }
      })
    })
    observer.observe(widget)

    const windowWidget = window.frames.swapzoneExchangeWidget

    document.addEventListener('click', () => {
      windowWidget.postMessage('clickOutside', '*')
    })

    const receiveMessage = (e) => {
      const wrapper = document.createElement('div')
      const iframe = document.createElement('iframe');

      if (e.data.exchangeData && e.data.exchangeWindowWidgetIsOpen === 'open') {

        wrapper.setAttribute('style', `position:fixed; top:50%; left:50%; display:flex; justify-content:center; inset:0px; height:100vh; width:100vw; z-index:10000; background: rgba(16,16,16,0.4); align-items:start; overflow-y:scroll; overflow-x:hidden; z-index: 999999;`)
        if (window.screen.width < 530) {
          wrapper.setAttribute('style','align-items:center; justify-content:center; display:flex; position:fixed; top:5%; overflow-y:scroll; overflow-x:hidden; height:100vh; z-index: 999999;')
        }
        wrapper.setAttribute('id', 'exchangeWindowWidgetWrapper')
        const width = iframeExchangeWindowWidth;
        const height = iframeExchangeWindowHeight;

        const data = e.data.exchangeData
        iframe.setAttribute(
          'src',
          `${url}/exchange-window-widget?amount=${data.amount}&exchangeOffer_deposit_extraIdRequired=${data.exchangeOffer.deposit.extraIdRequired}&exchangeOffer_partner_quotaId=${data.exchangeOffer.partner.quotaId}&exchangeOffer_partner_reqiredRefund=${data.exchangeOffer.partner.reqiredRefund}&exchangeOffer_rate_best=${data.exchangeOffer.rate.best}&exchangeOffer_rate_from=${data.exchangeOffer.rate.from}&exchangeOffer_rate_limit_min=${data.exchangeOffer.rate.limit.min}&exchangeOffer_rate_limit_max=${data.exchangeOffer.rate.limit.max}&exchangeOffer_rate_partner=${data.exchangeOffer.rate.partner}&exchangeOffer_rate_rate=${data.exchangeOffer.rate.rate}&exchangeOffer_rate_to=${data.exchangeOffer.rate.to}&exchangeOffer_receive_extraIdRequired=${data.exchangeOffer.receive.extraIdRequired}&fixedRate=${data.fixedRate}&from=${data.from}&price=${data.price}&to=${data.to}&exchangeOffer_rate_offerReferenceId=${data.exchangeOffer.rate.offerReferenceId}&referralId=${data.exchangeOffer.referralId}&mode=${mode}&theme=${theme}`
        )
        iframe.setAttribute('height', height.toString())
        iframe.setAttribute('width', width.toString())
        iframe.setAttribute('style', `border-radius: 16px; max-width: ${iframeExchangeWindowWidth}px; border:0; margin:auto;`)
        iframe.setAttribute('name', 'swapzoneExchangeWindowWidget')

        wrapper.appendChild(iframe)
        body.appendChild(wrapper)

      } else if (e.data.exchangeWindowWidgetIsOpen === 'close') {
        document.body.removeChild(document.getElementById('exchangeWindowWidgetWrapper'))
      }
    }

    window.addEventListener('message', receiveMessage, false)
  }
})()
