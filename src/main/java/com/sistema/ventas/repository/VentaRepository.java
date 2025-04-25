package com.sistema.ventas.repository;

import com.sistema.ventas.model.Cliente;
import com.sistema.ventas.model.Usuario;
import com.sistema.ventas.model.Venta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface VentaRepository extends JpaRepository<Venta, Long> {
    Optional<Venta> findByNumeroFactura(String numeroFactura);
    List<Venta> findByCliente(Cliente cliente);
    List<Venta> findByUsuario(Usuario usuario);
    List<Venta> findByFechaBetween(LocalDateTime fechaInicio, LocalDateTime fechaFin);
    
    @Query("SELECT v FROM Venta v WHERE YEAR(v.fecha) = ?1 AND MONTH(v.fecha) = ?2")
    List<Venta> findByYearAndMonth(int year, int month);
    
    @Query("SELECT v FROM Venta v WHERE YEAR(v.fecha) = ?1")
    List<Venta> findByYear(int year);
    
    @Query("SELECT SUM(v.total) FROM Venta v WHERE YEAR(v.fecha) = ?1 AND MONTH(v.fecha) = ?2")
    Double sumTotalByYearAndMonth(int year, int month);
}
