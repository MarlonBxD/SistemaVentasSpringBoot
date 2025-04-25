package com.sistema.ventas.controller;

import com.sistema.ventas.dto.MovimientoInventarioDTO;
import com.sistema.ventas.service.MovimientoInventarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/inventario")
public class MovimientoInventarioController {

    @Autowired
    private MovimientoInventarioService movimientoInventarioService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<MovimientoInventarioDTO>> getAllMovimientos() {
        List<MovimientoInventarioDTO> movimientos = movimientoInventarioService.findAll();
        return ResponseEntity.ok(movimientos);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MovimientoInventarioDTO> getMovimientoById(@PathVariable Long id) {
        MovimientoInventarioDTO movimiento = movimientoInventarioService.findById(id);
        return ResponseEntity.ok(movimiento);
    }

    @GetMapping("/producto/{productoId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'VENDEDOR')")
    public ResponseEntity<List<MovimientoInventarioDTO>> getMovimientosByProducto(@PathVariable Long productoId) {
        List<MovimientoInventarioDTO> movimientos = movimientoInventarioService.findByProducto(productoId);
        return ResponseEntity.ok(movimientos);
    }

    @GetMapping("/fecha")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<MovimientoInventarioDTO>> getMovimientosByFecha(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaFin) {
        List<MovimientoInventarioDTO> movimientos = movimientoInventarioService.findByFecha(fechaInicio, fechaFin);
        return ResponseEntity.ok(movimientos);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MovimientoInventarioDTO> createMovimiento(@Valid @RequestBody MovimientoInventarioDTO movimientoDTO) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        
        // Aquí deberías obtener el ID del usuario a partir del username
        Long usuarioId = 1L; // Esto es un placeholder, deberías implementar la lógica real
        
        MovimientoInventarioDTO nuevoMovimiento = movimientoInventarioService.save(movimientoDTO, usuarioId);
        return new ResponseEntity<>(nuevoMovimiento, HttpStatus.CREATED);
    }
}
