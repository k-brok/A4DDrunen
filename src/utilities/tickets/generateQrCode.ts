import QRCode from 'qrcode'

export async function generateQrPng(data: string): Promise<Buffer> {
  return QRCode.toBuffer(data, {
    type: 'png',
    width: 600,
    margin: 1,
    errorCorrectionLevel: 'M',
  })
}
