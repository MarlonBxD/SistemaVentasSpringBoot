package com.sistema.ventas;

import com.sistema.ventas.model.Categoria;
import com.sistema.ventas.model.Rol;
import com.sistema.ventas.model.Usuario;
import com.sistema.ventas.repository.CategoriaRepository;
import com.sistema.ventas.repository.RolRepository;
import com.sistema.ventas.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RolRepository rolRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Inicializar roles
        initRoles();
        
        // Inicializar usuario administrador
        initAdmin();
        
        // Inicializar categorías básicas
        initCategorias();
    }

    private void initRoles() {
        if (rolRepository.count() == 0) {
            Rol rolAdmin = new Rol();
            rolAdmin.setNombre("ADMIN");
            rolAdmin.setDescripcion("Administrador del sistema");
            rolRepository.save(rolAdmin);

            Rol rolVendedor = new Rol();
            rolVendedor.setNombre("VENDEDOR");
            rolVendedor.setDescripcion("Vendedor");
            rolRepository.save(rolVendedor);
        }
    }

    private void initAdmin() {
        if (usuarioRepository.count() == 0) {
            Usuario admin = new Usuario();
            admin.setNombre("Admin");
            admin.setApellido("Sistema");
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setEmail("admin@sistema.com");
            admin.setActivo(true);

            Rol rolAdmin = rolRepository.findByNombre("ADMIN").orElseThrow();
            Set<Rol> roles = new HashSet<>();
            roles.add(rolAdmin);
            admin.setRoles(roles);

            usuarioRepository.save(admin);
        }
    }

    private void initCategorias() {
        if (categoriaRepository.count() == 0) {
            String[] categorias = {"Electrónicos", "Ropa", "Hogar", "Alimentos", "Bebidas"};
            
            for (String nombre : categorias) {
                Categoria categoria = new Categoria();
                categoria.setNombre(nombre);
                categoria.setDescripcion("Categoría de " + nombre.toLowerCase());
                categoriaRepository.save(categoria);
            }
        }
    }
}
