/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';

import PdfPrinter from 'pdfmake';
import { ConfigService } from '@nestjs/config';
import { BookingEntity } from 'src/booking/entities/booking.entity';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import path from 'path';

@Injectable()
export class PdfService {
  private printer: InstanceType<typeof PdfPrinter>;

  constructor(private readonly config: ConfigService) {
    const fontPath = path.join(__dirname, '..', 'assets', 'fonts');

    const fonts = {
      Roboto: {
        normal: path.join(fontPath, 'Roboto-Regular.ttf'),
        bold: path.join(fontPath, 'Roboto-Bold.ttf'),
        italics: path.join(fontPath, 'Roboto-Italic.ttf'),
        bolditalics: path.join(fontPath, 'Roboto-BoldItalic.ttf'),
      },
    };
    this.printer = new PdfPrinter(fonts);
  }

  async generateTicket(booking: BookingEntity): Promise<Buffer> {
    const {
      showtime,
      seats,
      bookerName,
      bookerEmail,
      bookingCode,
      totalAmount,
      createdAt,
    } = booking;
    const movie = showtime?.movie;

    const seatLabels = seats
      .sort((a, b) => a.row.localeCompare(b.row) || a.number - b.number)
      .map((s) => `${s.row}${s.number} (${s.type})`)
      .join(', ');

    const startTime = new Date(showtime.startTime);
    const dateStr = startTime.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const timeStr = startTime.toLocaleTimeString('th-TH', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const docDefinition: TDocumentDefinitions = {
      pageSize: 'A5',
      pageOrientation: 'landscape',
      pageMargins: [30, 30, 30, 30],
      background: [
        {
          canvas: [
            // Decorative dark header bar
            { type: 'rect', x: 0, y: 0, w: 595, h: 80, color: '#1a1a2e' },
          ],
        },
      ],
      content: [
        // ─── Header ─────────────────────────────────────────────────────────
        {
          columns: [
            {
              stack: [
                { text: 'CINEMA BOOKING', style: 'brand', color: '#e94560' },
                {
                  text: 'MOVIE TICKET',
                  style: 'ticketLabel',
                  color: '#ffffff',
                  margin: [0, 2, 0, 0],
                },
              ],
            },
            {
              text: bookingCode,
              style: 'bookingCode',
              alignment: 'right',
              color: '#e94560',
              margin: [0, 8, 0, 0],
            },
          ],
          margin: [0, 0, 0, 20],
        },

        // ─── Movie Title ─────────────────────────────────────────────────────
        {
          text: movie?.title ?? 'N/A',
          style: 'movieTitle',
          alignment: 'center',
          margin: [0, 0, 0, 4],
        },
        {
          text: `${movie?.genre ?? ''} · ${movie?.durationMinutes ?? 0} mins`,
          style: 'movieMeta',
          alignment: 'center',
          margin: [0, 0, 0, 20],
        },

        // ─── Divider ─────────────────────────────────────────────────────────
        {
          canvas: [
            {
              type: 'line',
              x1: 0,
              y1: 0,
              x2: 535,
              y2: 0,
              lineWidth: 1,
              lineColor: '#e0e0e0',
              dash: { length: 6 },
            },
          ],
        },
        { text: '', margin: [0, 0, 0, 12] },

        // ─── Info Grid ───────────────────────────────────────────────────────
        {
          columns: [
            {
              stack: [
                this.infoRow('📅 Date', dateStr),
                this.infoRow('⏰ Time', timeStr),
                this.infoRow('🏛️ Hall', showtime.hall),
              ],
              width: '50%',
            },
            {
              stack: [
                this.infoRow('🪑 Seats', seatLabels),
                this.infoRow('👤 Name', bookerName),
                this.infoRow('📧 Email', bookerEmail),
              ],
              width: '50%',
            },
          ],
          columnGap: 20,
        },

        // ─── Divider ─────────────────────────────────────────────────────────
        { text: '', margin: [0, 12, 0, 0] },
        {
          canvas: [
            {
              type: 'line',
              x1: 0,
              y1: 0,
              x2: 535,
              y2: 0,
              lineWidth: 1,
              lineColor: '#e0e0e0',
              dash: { length: 6 },
            },
          ],
        },
        { text: '', margin: [0, 0, 0, 12] },

        // ─── Total + Seat Legend ─────────────────────────────────────────────
        {
          columns: [
            {
              stack: [
                { text: 'Seat Types', style: 'sectionLabel' },
                {
                  ul: [
                    { text: 'Standard — Base price', style: 'legend' },
                    { text: 'Premium — 1.5× price', style: 'legend' },
                    { text: 'VIP — 2.5× price', style: 'legend' },
                  ],
                  margin: [0, 4, 0, 0],
                },
              ],
              width: '60%',
            },
            {
              stack: [
                {
                  text: 'TOTAL AMOUNT',
                  style: 'sectionLabel',
                  alignment: 'right',
                },
                {
                  text: `฿ ${Number(totalAmount).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
                  style: 'totalAmount',
                  alignment: 'right',
                  color: '#e94560',
                },
              ],
              width: '40%',
            },
          ],
        },

        // ─── Footer ──────────────────────────────────────────────────────────
        {
          text: `Issued: ${new Date(createdAt).toLocaleString('en-US')} · Please present this ticket at the entrance.`,
          style: 'footer',
          alignment: 'center',
          margin: [0, 20, 0, 0],
        },
      ],
      styles: {
        brand: { fontSize: 18, bold: true, characterSpacing: 2 },
        ticketLabel: { fontSize: 9, characterSpacing: 4 },
        bookingCode: { fontSize: 14, bold: true, characterSpacing: 1 },
        movieTitle: { fontSize: 22, bold: true, color: '#1a1a2e' },
        movieMeta: { fontSize: 10, color: '#666666' },
        infoLabel: {
          fontSize: 8,
          color: '#999999',
          bold: true,
          characterSpacing: 1,
        },
        infoValue: { fontSize: 10, color: '#222222', margin: [0, 2, 0, 8] },
        sectionLabel: {
          fontSize: 8,
          color: '#999999',
          bold: true,
          characterSpacing: 1,
        },
        legend: { fontSize: 9, color: '#555555' },
        totalAmount: { fontSize: 20, bold: true },
        footer: { fontSize: 8, color: '#aaaaaa', italics: true },
      },
      defaultStyle: { font: 'Roboto' },
    };

    return new Promise((resolve, reject) => {
      const pdfDoc = this.printer.createPdfKitDocument(docDefinition);
      const chunks: Buffer[] = [];
      pdfDoc.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
      pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
      pdfDoc.on('error', reject);
      pdfDoc.end();
    });
  }
  private infoRow(label: string, value: string) {
    return {
      stack: [
        { text: label.toUpperCase(), style: 'infoLabel' },
        { text: value || '–', style: 'infoValue' },
      ],
    };
  }
}
