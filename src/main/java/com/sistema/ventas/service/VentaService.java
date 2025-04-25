package com.sistema.ventas.service;

import com.sistema.ventas.dto.DetalleVentaDTO;
import com.sistema.ventas.dto.VentaDTO;
import com.sistema.ventas.exception.ResourceNotFoundException;
import com.sistema.ventas.model.*;
import com.sistema.ventas.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class VentaService {

    @Autowired
    private VentaRepository ventaRepository;

    @Autowired
    private DetalleVentaRepository detalleVentaRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private MovimientoInventarioRepository movimientoInventarioRepository;

    public List<VentaDTO> findAll() {
        return ventaRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public VentaDTO findById(Long id) {
        Venta venta = ventaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Venta no encontrada con id: " + id));
        return convertToDTO(venta);
    }

    public List<VentaDTO> findByCliente(Long clienteId) {
        Cliente cliente = clienteRepository.findById(clienteId)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado con id: " + clienteId));
        
        return ventaRepository.findByCliente(cliente).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<VentaDTO> findByFecha(LocalDateTime fechaInicio, LocalDateTime fechaFin) {
        return ventaRepository.findByFechaBetween(fechaInicio, fechaFin).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public VentaDTO save(VentaDTO ventaDTO, Long usuarioId) {
        // Obtener el cliente
        Cliente cliente = clienteRepository.findById(ventaDTO.getClienteId())
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado con id: " + ventaDTO.getClienteId()));
        
        // Obtener el usuario
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id: " + usuarioId));
        
        // Crear la venta
        Venta venta = new Venta();
        venta.setFecha(LocalDateTime.now());
        venta.setCliente(cliente);
        venta.setUsuario(usuario);
        
        // Generar número de factura
        String numeroFactura = generarNumeroFactura();
        venta.setNumeroFactura(numeroFactura);
        
        // Guardar la venta para obtener el ID
        venta = ventaRepository.save(venta);
        
        // Procesar los detalles
        for (DetalleVentaDTO detalleDTO : ventaDTO.getDetalles()) {
            Producto producto = productoRepository.findById(detalleDTO.getProductoId())
                    .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con id: " + detalleDTO.getProductoId()));
            
            // Verificar stock
            if (producto.getStock() < detalleDTO.getCantidad()) {
                throw new IllegalArgumentException("No hay suficiente stock para el producto: " + producto.getNombre());
            }
            
            // Crear detalle
            DetalleVenta detalle = new DetalleVenta();
            detalle.setVenta(venta);
            detalle.setProducto(producto);
            detalle.setCantidad(detalleDTO.getCantidad());
            detalle.setPrecioUnitario(producto.getPrecio());
            detalle.calcularSubtotal();
            
            // Agregar detalle a la venta
            venta.agregarDetalle(detalle);
            
            // Actualizar stock
            producto.setStock(producto.getStock() - detalleDTO.getCantidad());
            productoRepository.save(producto);
            
            // Registrar movimiento de inventario
            MovimientoInventario movimiento = new MovimientoInventario();
            movimiento.setProducto(producto);
            movimiento.setFecha(LocalDateTime.now());
            movimiento.setTipo("SALIDA");
            movimiento.setCantidad(detalleDTO.getCantidad());
            movimiento.setDescripcion("Venta #" + venta.getNumeroFactura());
            movimiento.setUsuario(usuario);
            movimiento.setVenta(venta);
            movimientoInventarioRepository.save(movimiento);
        }
        
        // Calcular totales
        venta.calcularTotales();
        
        // Guardar la venta con sus detalles
        venta = ventaRepository.save(venta);
        
        return convertToDTO(venta);
    }

    @Transactional
    public void delete(Long id) {
        Venta venta = ventaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Venta no encontrada con id: " + id));
        
        // Restaurar stock de productos
        for (DetalleVenta detalle : venta.getDetalles()) {
            Producto producto = detalle.getProducto();
            producto.setStock(producto.getStock() + detalle.getCantidad());
            productoRepository.save(producto);
        }
        
        ventaRepository.delete(venta);
    }

    // Método para generar número de factura
    private String generarNumeroFactura() {
        LocalDateTime now = LocalDateTime.now();
        String fecha = now.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        long count = ventaRepository.count() + 1;
        return "F" + fecha + String.format("%06d", count);
    }

    // Métodos de conversión
    private VentaDTO convertToDTO(Venta venta) {
        VentaDTO dto = new VentaDTO();
        dto.setId(venta.getId());
        dto.setNumeroFactura(venta.getNumeroFactura());
        dto.setFecha(venta.getFecha());
        dto.setSubtotal(venta.getSubtotal());
        dto.setImpuesto(venta.getImpuesto());
        dto.setTotal(venta.getTotal());
        dto.setClienteId(venta.getCliente().getId());
        dto.setClienteNombre(venta.getCliente().getNombre() + " " + venta.getCliente().getApellido());
        dto.setUsuarioId(venta.getUsuario().getId());
        dto.setUsuarioNombre(venta.getUsuario().getNombre() + " " + venta.getUsuario().getApellido());
        
        List<DetalleVentaDTO> detallesDTO = new ArrayList<>();
        for (DetalleVenta detalle : venta.getDetalles()) {
            DetalleVentaDTO detalleDTO = new DetalleVentaDTO();
            detalleDTO.setId(detalle.getId());
            detalleDTO.setProductoId(detalle.getProducto().getId());
            detalleDTO.setProductoNombre(detalle.getProducto().getNombre());
            detalleDTO.setCantidad(detalle.getCantidad());
            detalleDTO.setPrecioUnitario(detalle.getPrecioUnitario());
            detalleDTO.setSubtotal(detalle.getSubtotal());
            detallesDTO.add(detalleDTO);
        }
        dto.setDetalles(detallesDTO);
        
        return dto;
    }
}
