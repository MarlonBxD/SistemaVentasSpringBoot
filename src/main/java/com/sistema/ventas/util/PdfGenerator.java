package com.sistema.ventas.util;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import com.sistema.ventas.dto.DetalleVentaDTO;
import com.sistema.ventas.dto.VentaDTO;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.format.DateTimeFormatter;

@Component
public class PdfGenerator {

    public void generarFacturaPdf(VentaDTO venta, HttpServletResponse response) throws IOException {
        response.setContentType("application/pdf");
        response.setHeader("Content-Disposition", "attachment; filename=factura-" + venta.getNumeroFactura() + ".pdf");

        Document document = new Document(PageSize.A4);
        try {
            PdfWriter.getInstance(document, response.getOutputStream());
            document.open();

            // Título
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, BaseColor.BLACK);
            Paragraph title = new Paragraph("FACTURA", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);
            document.add(new Paragraph(" "));

            // Información de la factura
            document.add(new Paragraph("Número de Factura: " + venta.getNumeroFactura()));
            document.add(new Paragraph("Fecha: " + venta.getFecha().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss"))));
            document.add(new Paragraph("Cliente: " + venta.getClienteNombre()));
            document.add(new Paragraph("Vendedor: " + venta.getUsuarioNombre()));
            document.add(new Paragraph(" "));

            // Tabla de productos
            PdfPTable table = new PdfPTable(5);
            table.setWidthPercentage(100);
            table.setWidths(new float[]{1, 3, 1, 1, 1});

            // Encabezados
            PdfPCell cell = new PdfPCell(new Phrase("Producto"));
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            cell.setBackgroundColor(BaseColor.LIGHT_GRAY);
            table.addCell(cell);

            cell = new PdfPCell(new Phrase("Descripción"));
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            cell.setBackgroundColor(BaseColor.LIGHT_GRAY);
            table.addCell(cell);

            cell = new PdfPCell(new Phrase("Cantidad"));
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            cell.setBackgroundColor(BaseColor.LIGHT_GRAY);
            table.addCell(cell);

            cell = new PdfPCell(new Phrase("Precio"));
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            cell.setBackgroundColor(BaseColor.LIGHT_GRAY);
            table.addCell(cell);

            cell = new PdfPCell(new Phrase("Subtotal"));
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            cell.setBackgroundColor(BaseColor.LIGHT_GRAY);
            table.addCell(cell);

            // Detalles
            for (DetalleVentaDTO detalle : venta.getDetalles()) {
                table.addCell(String.valueOf(detalle.getProductoId()));
                table.addCell(detalle.getProductoNombre());
                table.addCell(String.valueOf(detalle.getCantidad()));
                table.addCell(String.valueOf(detalle.getPrecioUnitario()));
                table.addCell(String.valueOf(detalle.getSubtotal()));
            }

            document.add(table);
            document.add(new Paragraph(" "));

            // Totales
            Paragraph subtotal = new Paragraph("Subtotal: $" + venta.getSubtotal(), FontFactory.getFont(FontFactory.HELVETICA_BOLD));
            subtotal.setAlignment(Element.ALIGN_RIGHT);
            document.add(subtotal);

            Paragraph impuesto = new Paragraph("Impuesto: $" + venta.getImpuesto(), FontFactory.getFont(FontFactory.HELVETICA_BOLD));
            impuesto.setAlignment(Element.ALIGN_RIGHT);
            document.add(impuesto);

            Paragraph total = new Paragraph("Total: $" + venta.getTotal(), FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, BaseColor.BLACK));
            total.setAlignment(Element.ALIGN_RIGHT);
            document.add(total);

            document.close();
        } catch (DocumentException e) {
            throw new IOException(e);
        }
    }
}
