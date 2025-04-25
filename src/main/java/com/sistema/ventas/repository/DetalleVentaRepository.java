package com.sistema.ventas.repository;

import com.sistema.ventas.model.DetalleVenta;
import com.sistema.ventas.model.Producto;
import com.sistema.ventas.model.Venta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DetalleVentaRepository extends JpaRepository<DetalleVenta, Long> {
    List<DetalleVenta> findByVenta(Venta venta);
    List<DetalleVenta> findByProducto(Producto producto);
}
