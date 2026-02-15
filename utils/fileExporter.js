import ExcelJS from 'exceljs';
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, HeadingLevel, ImageRun } from 'docx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generatePewartaanExcel = async (data, sections) => {
    const workbook = new ExcelJS.Workbook();

    for (const section of sections) {
        const sheet = workbook.addWorksheet(section.name);
        sheet.columns = section.cols.map(col => ({
            header: col.replace(/_/g, ' ').toUpperCase(),
            key: col,
            width: 20
        }));
        sheet.addRows(data[section.dataKey] || []);
        sheet.getRow(1).font = { bold: true };
    }

    return workbook;
};

export const generatePewartaanWord = async (data) => {
    // Simplified logic from the controller, moved to a utility function
    // In a real scenario, we'd use a template or build the doc meticulously here
    const doc = new Document({
        sections: [{
            children: [
                new Paragraph({ text: data.judul, heading: HeadingLevel.TITLE, alignment: AlignmentType.CENTER }),
                new Paragraph({ text: `${data.hari}, ${new Date(data.tanggal_ibadah).toLocaleDateString('id-ID')}`, alignment: AlignmentType.CENTER }),
                new Paragraph({ text: data.tempat_jemaat, alignment: AlignmentType.CENTER }),
                new Paragraph({ text: '' }),
                new Paragraph({ text: 'AYAT FIRMAN:', heading: HeadingLevel.HEADING_2 }),
                new Paragraph({ text: data.ayat_firman }),
                new Paragraph({ text: 'TEMA:', heading: HeadingLevel.HEADING_2 }),
                new Paragraph({ text: data.tema_khotbah }),
                // ... and other sections would be built here
            ]
        }]
    });

    return await Packer.toBuffer(doc);
};
