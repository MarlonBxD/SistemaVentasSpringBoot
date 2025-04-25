package com.sistema.ventas.repository;

import com.sistema.ventas.model.MovimientoInventario;
import com.sistema.ventas.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MovimientoInventarioRepository extends JpaRepository<MovimientoInventario, Long> {
    List<MovimientoInventario> findByProducto(Producto producto);
    List<MovimientoInventario> findByFechaBetween(LocalDateTime fechaInicio, LocalDateTime fechaFin);
    List<MovimientoInventario> findByTipo(String tipo);
}
