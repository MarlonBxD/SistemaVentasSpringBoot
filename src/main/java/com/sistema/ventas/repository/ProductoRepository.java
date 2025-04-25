package com.sistema.ventas.repository;

import com.sistema.ventas.model.Categoria;
import com.sistema.ventas.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {
    List<Producto> findByNombreContainingIgnoreCase(String nombre);
    List<Producto> findByCategoria(Categoria categoria);
    
    @Query("SELECT p FROM Producto p WHERE p.stock <= p.stockMinimo")
    List<Producto> findProductosConStockBajo();
    
    @Query("SELECT p FROM Producto p WHERE p.stock = 0")
    List<Producto> findProductosSinStock();
    
    @Query(value = "SELECT p.* FROM productos p " +
            "JOIN detalles_venta dv ON p.id = dv.producto_id " +
            "GROUP BY p.id " +
            "ORDER BY SUM(dv.cantidad) DESC " +
            "LIMIT ?1", nativeQuery = true)
    List<Producto> findProductosMasVendidos(int limit);
}
