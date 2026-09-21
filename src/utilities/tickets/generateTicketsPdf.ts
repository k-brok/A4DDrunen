// utilities/tickets/generateTicketsPdf.ts
import { PDFDocument, StandardFonts, rgb, type PDFPage, type PDFFont, type PDFImage } from 'pdf-lib'
import { generateQrPng } from './generateQrCode'
import type { Payload } from 'payload'
import fs from 'fs/promises'
import path from 'path'
import sharp from 'sharp'

const MM = 2.83464567
const mm = (v: number) => v * MM

const PAGE_W = mm(210)
const PAGE_H = mm(297)
const HALF_H = PAGE_H / 2
const HALF_W = PAGE_W / 2
const MARGIN = mm(8)

const hex = (h: string) => {
  const n = parseInt(h.replace('#', ''), 16)
  return rgb(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255)
}

const COLOR_PRIMARY = hex('#E6007E')
const COLOR_SECONDARY = hex('#9B1B5A')
const COLOR_ACCENT = hex('#2B9AC8')
const COLOR_GREEN = hex('#8CB808')
const COLOR_CREAM = hex('#FFF8F2')
const COLOR_WHITE = rgb(1, 1, 1)
const COLOR_TEXT = hex('#4A4A4A')
const COLOR_MUTED = hex('#8A8A8A')

function roundedRectPath(w: number, h: number, r: number): string {
  return `M ${r},0 L ${w - r},0 Q ${w},0 ${w},${r} L ${w},${h - r} Q ${w},${h} ${w - r},${h}
    L ${r},${h} Q 0,${h} 0,${h - r} L 0,${r} Q 0,0 ${r},0 Z`
}

function drawRoundedRect(
  page: PDFPage,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  options: {
    color?: ReturnType<typeof rgb>
    borderColor?: ReturnType<typeof rgb>
    borderWidth?: number
    borderDashArray?: number[]
  },
) {
  page.drawSvgPath(roundedRectPath(w, h, r), { x, y: y + h, ...options })
}

function wrapText(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let current = ''
  for (const word of words) {
    const test = current ? `${current} ${word}` : word
    if (font.widthOfTextAtSize(test, size) > maxWidth && current) {
      lines.push(current)
      current = word
    } else {
      current = test
    }
  }
  if (current) lines.push(current)
  return lines
}

function drawDashedLine(
  page: PDFPage,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color = COLOR_SECONDARY,
) {
  page.drawLine({
    start: { x: x1, y: y1 },
    end: { x: x2, y: y2 },
    thickness: 1,
    color,
    dashArray: [4, 3],
  })
}

let logoBufferPromise: Promise<Buffer> | null = null
let flagsBufferPromise: Promise<Buffer> | null = null

async function loadSvgAsPng(relativePath: string, widthPx: number): Promise<Buffer> {
  const absPath = path.join(process.cwd(), relativePath)
  const svgBuffer = await fs.readFile(absPath)
  return sharp(svgBuffer, { density: 300 }).resize({ width: widthPx }).png().toBuffer()
}

function getLogoBuffer() {
  if (!logoBufferPromise)
    logoBufferPromise = loadSvgAsPng('public/img/avond4daagse_drunen.svg', 800)
  return logoBufferPromise
}
function getFlagsBuffer() {
  if (!flagsBufferPromise) flagsBufferPromise = loadSvgAsPng('public/img/Vlaggetjes.svg', 2000)
  return flagsBufferPromise
}

function drawImageContained(
  page: PDFPage,
  image: PDFImage,
  x: number,
  y: number,
  maxW: number,
  maxH: number,
  align: 'left' | 'center' = 'left',
) {
  const scale = Math.min(maxW / image.width, maxH / image.height)
  const w = image.width * scale
  const h = image.height * scale
  const drawX = align === 'center' ? x + (maxW - w) / 2 : x
  page.drawImage(image, { x: drawX, y: y + (maxH - h), width: w, height: h })
  return { width: w, height: h }
}

// Rekt de vlaggetjes-banner over de volle paginabreedte (randtot-rand), i.p.v.
// de beeldverhouding te behouden — dit is bewust decoratief, geen logo.
function drawFlagsBanner(page: PDFPage, image: PDFImage, y: number, height: number) {
  page.drawImage(image, { x: 0, y, width: PAGE_W, height })
}

type ScheduleEntry = { label: string; time: string; location: string }

type SelectedOption = {
  label: string
  inputValue?: string
}

type TicketData = {
  participantName: string
  participantNumber?: number
  editionTitle: string
  routeTitle: string
  routeDistance: number
  schedule: ScheduleEntry[]
  selectedOptions: SelectedOption[]
  sponsorLogoBytes?: Uint8Array
  sponsorLogoIsJpg?: boolean
  qrPngBytes?: Uint8Array
}

// ── Simpele vector-iconen (geen emoji/font-afhankelijkheid) ───────────
function drawCutIcon(
  page: PDFPage,
  cx: number,
  cy: number,
  size: number,
  color: ReturnType<typeof rgb>,
) {
  // Stilistische schaar: twee kruisende lijnen + twee "ringen"
  const half = size / 2
  page.drawLine({
    start: { x: cx - half, y: cy + half },
    end: { x: cx + half, y: cy - half },
    thickness: 1.5,
    color,
  })
  page.drawLine({
    start: { x: cx - half, y: cy - half },
    end: { x: cx + half, y: cy + half },
    thickness: 1.5,
    color,
  })
  page.drawCircle({
    x: cx - half + size * 0.12,
    y: cy - half + size * 0.12,
    size: size * 0.14,
    borderColor: color,
    borderWidth: 1.3,
  })
  page.drawCircle({
    x: cx - half + size * 0.12,
    y: cy + half - size * 0.12,
    size: size * 0.14,
    borderColor: color,
    borderWidth: 1.3,
  })
}

function drawFoldIcon(
  page: PDFPage,
  cx: number,
  cy: number,
  size: number,
  color: ReturnType<typeof rgb>,
) {
  // Rechthoek met stippellijn in het midden + gebogen pijl die het vouwen suggereert
  const w = size
  const h = size * 0.65
  page.drawRectangle({
    x: cx - w / 2,
    y: cy - h / 2,
    width: w,
    height: h,
    borderColor: color,
    borderWidth: 1.3,
  })
  page.drawLine({
    start: { x: cx, y: cy - h / 2 },
    end: { x: cx, y: cy + h / 2 },
    thickness: 1,
    color,
    dashArray: [2, 1.5],
  })
  // Pijlpunt rechtsboven, suggereert het omklappen van de rechterhelft
  page.drawLine({
    start: { x: cx + w / 4, y: cy + h / 2 + 1 },
    end: { x: cx + w / 4 + 3, y: cy + h / 2 + 4 },
    thickness: 1.3,
    color,
  })
  page.drawLine({
    start: { x: cx + w / 4 + 3, y: cy + h / 2 + 4 },
    end: { x: cx + w / 4 - 1, y: cy + h / 2 + 5.5 },
    thickness: 1.3,
    color,
  })
}

function drawCardIcon(
  page: PDFPage,
  cx: number,
  cy: number,
  size: number,
  color: ReturnType<typeof rgb>,
) {
  // Afgerond kaartje met een vinkje — "klaar"
  const w = size
  const h = size * 0.65
  drawRoundedRect(page, cx - w / 2, cy - h / 2, w, h, 2, { borderColor: color, borderWidth: 1.3 })
  const cxCheck = cx - w * 0.18
  page.drawLine({
    start: { x: cxCheck - 2.5, y: cy - 0.5 },
    end: { x: cxCheck, y: cy - 3 },
    thickness: 1.5,
    color,
  })
  page.drawLine({
    start: { x: cxCheck, y: cy - 3 },
    end: { x: cxCheck + 5, y: cy + 3.5 },
    thickness: 1.5,
    color,
  })
}

async function drawTicketPage(
  pdfDoc: PDFDocument,
  font: PDFFont,
  boldFont: PDFFont,
  logoImage: PDFImage,
  flagsImage: PDFImage,
  data: TicketData,
) {
  const page = pdfDoc.addPage([PAGE_W, PAGE_H])
  // Bewust geen achtergrondvlak — puur wit, kost geen inkt.

  // ══════════════════ BOVENSTE HELFT — instructie ══════════════════
  page.drawRectangle({
    x: 0,
    y: PAGE_H - mm(2.5),
    width: PAGE_W,
    height: mm(2.5),
    color: COLOR_PRIMARY,
  })

  const logoH = mm(16)
  const logoY = PAGE_H - mm(2.5) - mm(4) - logoH
  drawImageContained(page, logoImage, MARGIN, logoY, mm(55), logoH)
  page.drawText('Jouw persoonlijke toegangskaartje', {
    x: PAGE_W - MARGIN - mm(85),
    y: logoY + logoH / 2 - mm(1.5), // verticaal gecentreerd t.o.v. het logo
    size: 12,
    font: boldFont,
    color: COLOR_SECONDARY,
  })

  const flagsH = mm(11)
  const flagsY = logoY - mm(4) - flagsH
  drawFlagsBanner(page, flagsImage, flagsY, flagsH)

  page.drawText('Zo maak je van dit vel je toegangskaartje', {
    x: MARGIN,
    y: flagsY - mm(9),
    size: 13,
    font: boldFont,
    color: COLOR_SECONDARY,
  })

  const steps: {
    text: string
    icon: (p: PDFPage, cx: number, cy: number, s: number, c: ReturnType<typeof rgb>) => void
  }[] = [
    {
      text: 'Knip dit vel over de volle breedte door, precies op de roze lijn hieronder.',
      icon: drawCutIcon,
    },
    {
      text: 'Je houdt de onderste strook over. Vouw deze dubbel over de blauwe lijn, met de bedrukte kant naar buiten.',
      icon: drawFoldIcon,
    },
    {
      text: 'Je hebt nu een kaartje met een voor- en achterkant. Laminéren wordt aangeraden zodat het kaartje tegen een stootje kan tijdens het lopen.',
      icon: drawCardIcon,
    },
  ]
  const stepColors = [COLOR_PRIMARY, COLOR_ACCENT, COLOR_GREEN]

  const STEP_SLOT_H = mm(17)
  const numR = mm(4.2)
  const iconSize = mm(7)
  const iconX = MARGIN + numR * 2 + mm(4)
  const textX = iconX + iconSize + mm(5)
  const textW = PAGE_W - textX - MARGIN

  let stepTop = flagsY - mm(17)

  for (const [i, step] of steps.entries()) {
    const circleCy = stepTop - numR
    page.drawCircle({ x: MARGIN + numR, y: circleCy, size: numR, color: stepColors[i] })
    const numStr = String(i + 1)
    const numW = boldFont.widthOfTextAtSize(numStr, 10)
    // Verticaal gecentreerd in de cirkel: baseline iets onder het middelpunt
    page.drawText(numStr, {
      x: MARGIN + numR - numW / 2,
      y: circleCy - mm(1.6),
      size: 10,
      font: boldFont,
      color: COLOR_WHITE,
    })

    step.icon(page, iconX + iconSize / 2, circleCy, iconSize, stepColors[i])

    const lines = wrapText(step.text, font, 9.5, textW)
    // Tekstblok verticaal centreren op dezelfde hoogte als het rondje/icoon
    const blockH = lines.length * mm(4.4)
    let lineY = circleCy + blockH / 2 - mm(3)
    for (const line of lines) {
      page.drawText(line, { x: textX, y: lineY, size: 9.5, font, color: COLOR_TEXT })
      lineY -= mm(4.4)
    }

    stepTop -= STEP_SLOT_H
  }

  const tipH = mm(13)
  drawRoundedRect(page, MARGIN, stepTop - tipH + mm(4), PAGE_W - MARGIN * 2, tipH, mm(4), {
    color: COLOR_WHITE,
    borderColor: COLOR_PRIMARY,
    borderWidth: 1.25,
  })
  page.drawText('Tip: bewaar dit kaartje goed — je hebt het nodig bij de start van elke avond!', {
    x: MARGIN + mm(5),
    y: stepTop - mm(6.5),
    size: 9.5,
    font: boldFont,
    color: COLOR_SECONDARY,
  })

  // Knip-lijn: nu roze (matcht stap 1) met een klein "1"-rondje i.p.v. tekstlabel
  drawDashedLine(page, MARGIN, HALF_H, PAGE_W - MARGIN, HALF_H, COLOR_PRIMARY)
  page.drawCircle({ x: PAGE_W - MARGIN - mm(4), y: HALF_H, size: mm(3.2), color: COLOR_PRIMARY })
  page.drawText('1', {
    x: PAGE_W - MARGIN - mm(5.1),
    y: HALF_H - mm(1.3),
    size: 8,
    font: boldFont,
    color: COLOR_WHITE,
  })

  // Vouw-lijn: blauw (matcht stap 2) met een klein "2"-rondje
  drawDashedLine(page, HALF_W, 0, HALF_W, HALF_H, COLOR_ACCENT)
  page.drawCircle({ x: HALF_W, y: mm(6), size: mm(3.2), color: COLOR_ACCENT })
  page.drawText('2', {
    x: HALF_W - mm(1.1),
    y: mm(4.7),
    size: 8,
    font: boldFont,
    color: COLOR_WHITE,
  })

  // ══════════════════ VOORZIJDE (links-onder) ══════════════════
  const frontPad = mm(9) // was mm(6) — grotere marge zoals gevraagd
  const frontX = frontPad
  const frontW = HALF_W - frontPad * 2

  drawRoundedRect(page, mm(3), mm(3), HALF_W - mm(6), HALF_H - mm(6), mm(5), {
    borderColor: COLOR_PRIMARY,
    borderWidth: 1,
    borderDashArray: [3, 2],
  })

  page.drawText(data.editionTitle, {
    x: frontX,
    y: HALF_H - mm(14),
    size: 12,
    font: boldFont,
    color: COLOR_PRIMARY,
    maxWidth: frontW,
  })
  page.drawLine({
    start: { x: frontX, y: HALF_H - mm(18) },
    end: { x: HALF_W - frontPad, y: HALF_H - mm(18) },
    thickness: 2,
    color: COLOR_PRIMARY,
  })

  const wmSize = mm(75)
  page.drawImage(logoImage, {
    x: frontX - mm(5),
    y: mm(12),
    width: wmSize,
    height: wmSize * (logoImage.height / logoImage.width),
    opacity: 0.05,
  })

  let frontY = HALF_H - mm(32)

  // Deelnemersnummer, klein en duidelijk boven de QR-plek
  if (data.participantNumber != null) {
    page.drawText(`Deelnemer #${data.participantNumber}`, {
      x: frontX,
      y: frontY + mm(4),
      size: 9,
      font: boldFont,
      color: COLOR_MUTED,
    })
  }

  const qrSize = mm(38)
  if (data.qrPngBytes) {
    const qrImage = await pdfDoc.embedPng(data.qrPngBytes)
    drawRoundedRect(page, frontX, frontY - qrSize, qrSize, qrSize, mm(4), {
      color: COLOR_WHITE,
      borderColor: COLOR_ACCENT,
      borderWidth: 1.5,
    })
    page.drawImage(qrImage, {
      x: frontX + mm(2),
      y: frontY - qrSize + mm(2),
      width: qrSize - mm(4),
      height: qrSize - mm(4),
    })
  } else {
    drawRoundedRect(page, frontX, frontY - qrSize, qrSize, qrSize, mm(4), {
      color: COLOR_WHITE,
      borderColor: COLOR_ACCENT,
      borderWidth: 1.5,
    })
    page.drawText('QR-code', {
      x: frontX + mm(4.5),
      y: frontY - qrSize / 2 - 3,
      size: 9,
      font,
      color: COLOR_MUTED,
    })
  }

  const nameX = frontX + qrSize + mm(7)
  const nameW = frontW - qrSize - mm(7)
  page.drawText('DEELNEMER', {
    x: nameX,
    y: frontY - mm(2),
    size: 7.5,
    font: boldFont,
    color: COLOR_ACCENT,
  })

  let nameY = frontY - mm(9)
  for (const line of wrapText(data.participantName, boldFont, 15, nameW)) {
    page.drawText(line, { x: nameX, y: nameY, size: 15, font: boldFont, color: COLOR_TEXT })
    nameY -= mm(6.5)
  }

  let extrasY = nameY - mm(3)
  for (const opt of data.selectedOptions) {
    const line = opt.inputValue ? `${opt.label}: ${opt.inputValue}` : opt.label
    for (const wrapped of wrapText(line, font, 9, nameW)) {
      page.drawText(wrapped, { x: nameX, y: extrasY, size: 9, font, color: COLOR_MUTED })
      extrasY -= mm(4.2)
    }
  }

  frontY = Math.min(frontY - qrSize, extrasY - mm(4)) - mm(16)

  const badgeR = mm(11)
  const badgeCx = frontX + badgeR
  const badgeCy = frontY - badgeR
  page.drawCircle({ x: badgeCx, y: badgeCy, size: badgeR, color: COLOR_GREEN })
  const distanceLabel = String(data.routeDistance).replace('.', ',')
  const distW = boldFont.widthOfTextAtSize(distanceLabel, 13)
  page.drawText(distanceLabel, {
    x: badgeCx - distW / 2,
    y: badgeCy - mm(3.5),
    size: 13,
    font: boldFont,
    color: COLOR_WHITE,
  })
  page.drawText('km', {
    x: badgeCx - mm(3),
    y: badgeCy - mm(8.5),
    size: 7,
    font: boldFont,
    color: COLOR_WHITE,
  })

  page.drawText(data.routeTitle, {
    x: frontX + badgeR * 2 + mm(5),
    y: frontY - badgeR - mm(2),
    size: 13,
    font: boldFont,
    color: COLOR_SECONDARY,
    maxWidth: frontW - badgeR * 2 - mm(5),
  })

  // ══════════════════ ACHTERZIJDE (rechts-onder) ══════════════════
  const backPad = mm(9) // was mm(6)
  const backX = HALF_W + backPad
  const backW = HALF_W - backPad * 2

  drawRoundedRect(page, HALF_W + mm(3), mm(3), HALF_W - mm(6), HALF_H - mm(6), mm(5), {
    borderColor: COLOR_ACCENT,
    borderWidth: 1,
    borderDashArray: [3, 2],
  })

  page.drawText('Starttijden', {
    x: backX,
    y: HALF_H - mm(14),
    size: 12,
    font: boldFont,
    color: COLOR_ACCENT,
  })
  page.drawLine({
    start: { x: backX, y: HALF_H - mm(18) },
    end: { x: PAGE_W - backPad, y: HALF_H - mm(18) },
    thickness: 2,
    color: COLOR_ACCENT,
  })

  const dayCount = Math.max(data.schedule.length, 1)
  const sponsorBoxH = mm(38)
  const scheduleTop = HALF_H - mm(26)
  const scheduleBottom = MARGIN + sponsorBoxH + mm(10)
  const rowH = (scheduleTop - scheduleBottom) / dayCount

  let backY = scheduleTop
  for (const entry of data.schedule) {
    page.drawRectangle({
      x: backX - mm(2),
      y: backY - rowH + mm(3),
      width: mm(1.2),
      height: rowH - mm(4),
      color: COLOR_ACCENT,
    })
    page.drawText(entry.label, {
      x: backX + mm(3),
      y: backY - mm(6),
      size: 9.5,
      font: boldFont,
      color: COLOR_SECONDARY,
    })
    const timeLine = entry.time ? `${entry.time} — ${entry.location}` : 'Tijd nog niet bekend'
    page.drawText(timeLine, {
      x: backX + mm(3),
      y: backY - mm(11.5),
      size: 9.5,
      font,
      color: COLOR_TEXT,
      maxWidth: backW - mm(3),
    })
    backY -= rowH
  }

  if (data.sponsorLogoBytes) {
    try {
      const image = data.sponsorLogoIsJpg
        ? await pdfDoc.embedJpg(data.sponsorLogoBytes)
        : await pdfDoc.embedPng(data.sponsorLogoBytes)

      drawRoundedRect(page, backX - mm(2), MARGIN - mm(2), backW + mm(4), sponsorBoxH, mm(5), {
        color: COLOR_WHITE,
        borderColor: COLOR_ACCENT,
        borderWidth: 1.5,
      })
      page.drawText('MEDE MOGELIJK GEMAAKT DOOR', {
        x: backX,
        y: MARGIN + sponsorBoxH - mm(7),
        size: 7,
        font: boldFont,
        color: COLOR_MUTED,
      })
      drawImageContained(page, image, backX, MARGIN + mm(2), backW, sponsorBoxH - mm(12))
    } catch {
      // logo kon niet worden ingeladen — ticket blijft verder gewoon bruikbaar
    }
  }
}

export async function generateRegistrationTicketsPdf(
  payload: Payload,
  registrationId: string | number,
  options?: { participantId?: string | number },
): Promise<Uint8Array> {
  const registration = await payload.findByID({
    collection: 'inschrijvingen',
    id: registrationId,
    depth: 1,
  })
  const edition = (registration as any).edition

  const { docs: allDeelnemers } = await payload.find({
    collection: 'deelnemers',
    where: { registration: { equals: registrationId } },
    depth: 2,
    limit: 100,
  })

  const deelnemers = options?.participantId
    ? (allDeelnemers as any[]).filter((d) => String(d.id) === String(options.participantId))
    : (allDeelnemers as any[])

  const { docs: dagen } = await payload.find({
    collection: 'dagen',
    where: { edition: { equals: typeof edition === 'object' ? edition.id : edition } },
    sort: 'date',
    depth: 1,
    limit: 100,
  })

  const pdfDoc = await PDFDocument.create()
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  const [logoBuffer, flagsBuffer] = await Promise.all([getLogoBuffer(), getFlagsBuffer()])
  const logoImage = await pdfDoc.embedPng(logoBuffer)
  const flagsImage = await pdfDoc.embedPng(flagsBuffer)

  const logoCache = new Map<string, { bytes: Uint8Array; isJpg: boolean } | null>()

  for (const deelnemer of deelnemers) {
    const route = deelnemer.route

    const schedule: ScheduleEntry[] = (dagen as any[]).map((dag) => {
      const override = (dag.routeOverrides || []).find((o: any) => {
        const overrideRouteId = typeof o.route === 'object' ? o.route?.id : o.route
        const participantRouteId = typeof route === 'object' ? route.id : route
        return String(overrideRouteId) === String(participantRouteId)
      })
      const startTime = override?.startTime || dag.startTime
      const startLocation = override?.startLocation || dag.startLocation
      return {
        label: dag.label,
        time: startTime
          ? new Date(startTime).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })
          : '',
        location: startLocation || '',
      }
    })

    let sponsorLogoBytes: Uint8Array | undefined
    let sponsorLogoIsJpg = false
    const sponsor = deelnemer.sponsor

    if (sponsor && typeof sponsor === 'object' && sponsor.logo) {
      const logoDoc = sponsor.logo
      const url = typeof logoDoc === 'object' ? logoDoc.url : undefined
      if (url) {
        if (logoCache.has(url)) {
          const cached = logoCache.get(url)
          sponsorLogoBytes = cached?.bytes
          sponsorLogoIsJpg = cached?.isJpg ?? false
        } else {
          try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}${url}`)
            const bytes = new Uint8Array(await res.arrayBuffer())
            const isJpg = /\.jpe?g$/i.test(url)
            logoCache.set(url, { bytes, isJpg })
            sponsorLogoBytes = bytes
            sponsorLogoIsJpg = isJpg
          } catch {
            logoCache.set(url, null)
          }
        }
      }
    }

    const selectedOptions: SelectedOption[] = (deelnemer.selectedOptions || []).map((so: any) => ({
      label: typeof so.option === 'object' ? so.option.label : '',
      inputValue: so.inputValue || undefined,
    }))

    const qrPngBytes = new Uint8Array(await generateQrPng(deelnemer.checkInToken))

    await drawTicketPage(pdfDoc, font, boldFont, logoImage, flagsImage, {
      participantName: deelnemer.name,
      participantNumber: deelnemer.participantNumber,
      editionTitle: typeof edition === 'object' ? edition.title : '',
      routeTitle: typeof route === 'object' ? route.title : '',
      routeDistance: typeof route === 'object' ? route.distance : 0,
      schedule,
      selectedOptions,
      sponsorLogoBytes,
      sponsorLogoIsJpg,
      qrPngBytes,
    })
  }

  return pdfDoc.save()
}
