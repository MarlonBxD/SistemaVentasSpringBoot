package com.sistema.ventas.controller;

import com.sistema.ventas.dto.VentaDTO;
import com.sistema.ventas.service.VentaService;
import com.sistema.ventas.util.PdfGenerator;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/ventas")
public class VentaController {

    @Autowired
    private VentaService ventaService;

    @Autowired
    private PdfGenerator pdfGenerator;

    @GetMapping
    public ResponseEntity<List<VentaDTO>> getAllVentas() {
        List<VentaDTO> ventas = ventaService.findAll();
        return ResponseEntity.ok(ventas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<VentaDTO> getVentaById(@PathVariable Long id) {
        VentaDTO venta = ventaService.findById(id);
        return ResponseEntity.ok(venta);
    }

    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<VentaDTO>> getVentasByCliente(@PathVariable Long clienteId) {
        List<VentaDTO> ventas = ventaService.findByCliente(clienteId);
        return ResponseEntity.ok(ventas);
    }

    @GetMapping("/fecha")
    public ResponseEntity<List<VentaDTO>> getVentasByFecha(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaFin) {
        List<VentaDTO> ventas = ventaService.findByFecha(fechaInicio, fechaFin);
        return ResponseEntity.ok(ventas);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'VENDEDOR')")
    public ResponseEntity<VentaDTO> createVenta(@Valid @RequestBody VentaDTO ventaDTO) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        
        // Aquí deberías obtener el ID del usuario a partir del username
        Long usuarioId = 1L; // Esto es un placeholder, deberías implementar la lógica real
        
        VentaDTO nuevaVenta = ventaService.save(ventaDTO, usuarioId);
        return new ResponseEntity<>(nuevaVenta, HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteVenta(@PathVariable Long id) {
        ventaService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/factura")
    public void generarFactura(@PathVariable Long id, HttpServletResponse response) throws IOException {
        VentaDTO venta = ventaService.findById(id);
        pdfGenerator.generarFacturaPdf(venta, response);
    }
}
