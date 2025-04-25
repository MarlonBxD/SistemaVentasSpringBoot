package com.sistema.ventas.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MovimientoInventarioDTO {
    private Long id;
    
    @NotNull(message = "El producto es obligatorio")
    private Long productoId;
    private String productoNombre;
    
    private LocalDateTime fecha;
    
    @NotBlank(message = "El tipo de movimiento es obligatorio")
    private String tipo; // ENTRADA, SALIDA, AJUSTE
    
    @NotNull(message = "La cantidad es obligatoria")
    @Min(value = 1, message = "La cantidad debe ser al menos 1")
    private Integer cantidad;
    
    private String descripcion;
    
    private Long usuarioId;
    private String usuarioNombre;
    
    private Long ventaId;
}
