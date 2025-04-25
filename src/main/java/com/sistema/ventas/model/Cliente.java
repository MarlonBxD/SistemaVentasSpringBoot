package com.sistema.ventas.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "clientes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private String apellido;

    @Column(name = "documento", nullable = false, unique = true)
    private String documento; // Cédula o RUC

    @Column(name = "tipo_documento")
    private String tipoDocumento; // CI, RUC, etc.

    private String direccion;
    private String telefono;
    private String email;

    @OneToMany(mappedBy = "cliente")
    private List<Venta> ventas;
}
