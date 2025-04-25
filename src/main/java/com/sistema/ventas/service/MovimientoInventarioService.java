package com.sistema.ventas.service;

import com.sistema.ventas.dto.MovimientoInventarioDTO;
import com.sistema.ventas.exception.ResourceNotFoundException;
import com.sistema.ventas.model.MovimientoInventario;
import com.sistema.ventas.model.Producto;
import com.sistema.ventas.model.Usuario;
import com.sistema.ventas.model.Venta;
import com.sistema.ventas.repository.MovimientoInventarioRepository;
import com.sistema.ventas.repository.ProductoRepository;
import com.sistema.ventas.repository.UsuarioRepository;
import com.sistema.ventas.repository.VentaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MovimientoInventarioService {

    @Autowired
    private MovimientoInventarioRepository movimientoInventarioRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private VentaRepository ventaRepository;

    @Autowired
    private ProductoService productoService;

    public List<MovimientoInventarioDTO> findAll() {
        return movimientoInventarioRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public MovimientoInventarioDTO findById(Long id) {
        MovimientoInventario movimiento = movimientoInventarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Movimiento no encontrado con id: " + id));
        return convertToDTO(movimiento);
    }

    public List<MovimientoInventarioDTO> findByProducto(Long productoId) {
        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con id: " + productoId));
        
        return movimientoInventarioRepository.findByProducto(producto).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<MovimientoInventarioDTO> findByFecha(LocalDateTime fechaInicio, LocalDateTime fechaFin) {
        return movimientoInventarioRepository.findByFechaBetween(fechaInicio, fechaFin).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public MovimientoInventarioDTO save(MovimientoInventarioDTO movimientoDTO, Long usuarioId) {
        Producto producto = productoRepository.findById(movimientoDTO.getProductoId())
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con id: " + movimientoDTO.getProductoId()));
        
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id: " + usuarioId));
        
        MovimientoInventario movimiento = new MovimientoInventario();
        movimiento.setProducto(producto);
        movimiento.setFecha(LocalDateTime.now());
        movimiento.setTipo(movimientoDTO.getTipo());
        movimiento.setCantidad(movimientoDTO.getCantidad());
        movimiento.setDescripcion(movimientoDTO.getDescripcion());
        movimiento.setUsuario(usuario);
        
        if (movimientoDTO.getVentaId() != null) {
            Venta venta = ventaRepository.findById(movimientoDTO.getVentaId())
                    .orElseThrow(() -> new ResourceNotFoundException("Venta no encontrada con id: " + movimientoDTO.getVentaId()));
            movimiento.setVenta(venta);
        }
        
        // Actualizar stock del producto
        int cantidadAjuste = movimientoDTO.getCantidad();
        if (movimientoDTO.getTipo().equals("SALIDA")) {
            cantidadAjuste = -cantidadAjuste;
        }
        
        productoService.actualizarStock(producto.getId(), cantidadAjuste);
        
        movimiento = movimientoInventarioRepository.save(movimiento);
        return convertToDTO(movimiento);
    }

    // Métodos de conversión
    private MovimientoInventarioDTO convertToDTO(MovimientoInventario movimiento) {
        MovimientoInventarioDTO dto = new MovimientoInventarioDTO();
        dto.setId(movimiento.getId());
        dto.setProductoId(movimiento.getProducto().getId());
        dto.setProductoNombre(movimiento.getProducto().getNombre());
        dto.setFecha(movimiento.getFecha());
        dto.setTipo(movimiento.getTipo());
        dto.setCantidad(movimiento.getCantidad());
        dto.setDescripcion(movimiento.getDescripcion());
        
        if (movimiento.getUsuario() != null) {
            dto.setUsuarioId(movimiento.getUsuario().getId());
            dto.setUsuarioNombre(movimiento.getUsuario().getNombre() + " " + movimiento.getUsuario().getApellido());
        }
        
        if (movimiento.getVenta() != null) {
            dto.setVentaId(movimiento.getVenta().getId());
        }
        
        return dto;
    }
}
