/*
 *  
 * The MIT License (MIT)
 * Copyright (c) 2018 kukulkan
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
package com.example.domain;

import java.time.LocalDate;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonInclude;

import mx.infotec.dads.kukulkan.tables.annotations.Sheet;
import mx.infotec.dads.kukulkan.tables.annotations.SheetColumn;
import mx.infotec.dads.kukulkan.tables.handsontable.HandsontableOptions.Type;

import java.util.Objects;
import java.io.Serializable;

/**
 * The Persona
 * 
 * @author kukulkan
 *
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
@Sheet
@Entity
@Table(name = "personas")
public class Persona implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * Este campo fue generado automaticamente por kukulkan Este campo corresponde a
     * la llave primaria id
     *
     * @kukulkanGenerated 20180809165807
     */
    @SheetColumn(readOnly = true)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true, nullable = false)
    private Long id;

    /**
     * Este campo fue generado automaticamente por kukulkan Este campo corresponde a
     * la tabla personas
     *
     * @kukulkanGenerated 20180809165807
     */
    @SheetColumn
    @Column(name = "nombre")
    private String nombre;

    /**
     * Este campo fue generado automaticamente por kukulkan Este campo corresponde a
     * la tabla personas
     *
     * @kukulkanGenerated 20180809165807
     */
    @SheetColumn
    @Column(name = "apellido")
    private String apellido;

    /**
     * Este campo fue generado automaticamente por kukulkan Este campo corresponde a
     * la tabla personas
     *
     * @kukulkanGenerated 20180809165807
     */
    @SheetColumn
    @Column(name = "correo")
    private String correo;

    /**
     * Este campo fue generado automaticamente por kukulkan Este campo corresponde a
     * la tabla personas
     *
     * @kukulkanGenerated 20180809165807
     */
    @SheetColumn
    @Column(name = "empresa")
    private String empresa;

    /**
     * Este campo fue generado automaticamente por kukulkan Este campo corresponde a
     * la tabla personas
     *
     * @kukulkanGenerated 20180809165807
     */
    @SheetColumn
    @Column(name = "fecha_nacimiento")
    private LocalDate fechaNacimiento;

    /**
     * Este campo fue generado automaticamente por kukulkan Este campo corresponde a
     * la tabla personas
     *
     * @kukulkanGenerated 20180809165807
     */
    @SheetColumn
    @Column(name = "sueldo")
    private Float sueldo;

    @SheetColumn
    @Enumerated(EnumType.STRING)
    @Column(name = "genero")
    private Genero genero = Genero.HOMBRE;

    @SheetColumn(type = Type.HANDSONTABLE, data = "usuario.id")
    @OneToOne
    @JoinColumn(name = "usuario_id", unique = true)
    private User usuario;

    @SheetColumn(type = Type.HANDSONTABLE, data = "direccion.id")
    @ManyToOne
    @JoinColumn(name = "direccion_id")
    private Direccion direccion;

    /**
     * Este método fue generado automaticamente por kukulkan Este método GETTER fue
     * generado para la llave primaria personas.id
     *
     * @return el valor de id
     *
     * @kukulkanGenerated 20180809165807
     */
    public Long getId() {
        return id;
    }

    /**
     * Este método fue generado automaticamente por kukulkan Este método SETTER fue
     * generado para la llave primaria. personas.id
     *
     * @return el valor de id
     *
     * @kukulkanGenerated 20180809165807
     */
    public void setId(Long id) {
        this.id = id;
    }

    /**
     * Este método fue generado automaticamente por kukulkan Este método GETTER fue
     * generado para la propiedad personas.nombre
     *
     * @return el valor de nombre
     *
     * @kukulkanGenerated 20180809165807
     */
    public String getNombre() {
        return nombre;
    }

    /**
     * Este método fue generado automaticamente por kukulkan Este método SETTER fue
     * generado para la propiedad. personas.nombre
     *
     * @return el valor de Nombre
     *
     * @kukulkanGenerated 20180809165807
     */
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    /**
     * Este método fue generado automaticamente por kukulkan Este método GETTER fue
     * generado para la propiedad personas.apellido
     *
     * @return el valor de apellido
     *
     * @kukulkanGenerated 20180809165807
     */
    public String getApellido() {
        return apellido;
    }

    /**
     * Este método fue generado automaticamente por kukulkan Este método SETTER fue
     * generado para la propiedad. personas.apellido
     *
     * @return el valor de Apellido
     *
     * @kukulkanGenerated 20180809165807
     */
    public void setApellido(String apellido) {
        this.apellido = apellido;
    }

    /**
     * Este método fue generado automaticamente por kukulkan Este método GETTER fue
     * generado para la propiedad personas.correo
     *
     * @return el valor de correo
     *
     * @kukulkanGenerated 20180809165807
     */
    public String getCorreo() {
        return correo;
    }

    /**
     * Este método fue generado automaticamente por kukulkan Este método SETTER fue
     * generado para la propiedad. personas.correo
     *
     * @return el valor de Correo
     *
     * @kukulkanGenerated 20180809165807
     */
    public void setCorreo(String correo) {
        this.correo = correo;
    }

    /**
     * Este método fue generado automaticamente por kukulkan Este método GETTER fue
     * generado para la propiedad personas.empresa
     *
     * @return el valor de empresa
     *
     * @kukulkanGenerated 20180809165807
     */
    public String getEmpresa() {
        return empresa;
    }

    /**
     * Este método fue generado automaticamente por kukulkan Este método SETTER fue
     * generado para la propiedad. personas.empresa
     *
     * @return el valor de Empresa
     *
     * @kukulkanGenerated 20180809165807
     */
    public void setEmpresa(String empresa) {
        this.empresa = empresa;
    }

    /**
     * Este método fue generado automaticamente por kukulkan Este método GETTER fue
     * generado para la propiedad personas.fecha_nacimiento
     *
     * @return el valor de fechaNacimiento
     *
     * @kukulkanGenerated 20180809165807
     */
    public LocalDate getFechaNacimiento() {
        return fechaNacimiento;
    }

    /**
     * Este método fue generado automaticamente por kukulkan Este método SETTER fue
     * generado para la propiedad. personas.fechaNacimiento
     *
     * @return el valor de FechaNacimiento
     *
     * @kukulkanGenerated 20180809165807
     */
    public void setFechaNacimiento(LocalDate fechaNacimiento) {
        this.fechaNacimiento = fechaNacimiento;
    }

    /**
     * Este método fue generado automaticamente por kukulkan Este método GETTER fue
     * generado para la propiedad personas.sueldo
     *
     * @return el valor de sueldo
     *
     * @kukulkanGenerated 20180809165807
     */
    public Float getSueldo() {
        return sueldo;
    }

    /**
     * Este método fue generado automaticamente por kukulkan Este método SETTER fue
     * generado para la propiedad. personas.sueldo
     *
     * @return el valor de Sueldo
     *
     * @kukulkanGenerated 20180809165807
     */
    public void setSueldo(Float sueldo) {
        this.sueldo = sueldo;
    }

    /**
     * @return the genero
     */
    public Genero getGenero() {
        return genero;
    }

    /**
     * @param genero
     *            the genero to set
     */
    public void setGenero(Genero genero) {
        this.genero = genero;
    }

    /**
     * @return the direccion
     */
    public Direccion getDireccion() {
        return direccion;
    }

    /**
     * @param direccion
     *            the direccion to set
     */
    public void setDireccion(Direccion direccion) {
        this.direccion = direccion;
    }

    /**
     * @return the usuario
     */
    public User getUsuario() {
        return usuario;
    }

    /**
     * @param usuario
     *            the usuario to set
     */
    public void setUsuario(User usuario) {
        this.usuario = usuario;
    }

    enum Genero {
        HOMBRE, MUJER
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Persona persona = (Persona) o;
        if (persona.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), persona.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append(getClass().getSimpleName());
        sb.append(" [");
        sb.append("Hash = ").append(hashCode());
        sb.append(", nombre=").append(nombre);
        sb.append(", apellido=").append(apellido);
        sb.append(", correo=").append(correo);
        sb.append(", empresa=").append(empresa);
        sb.append(", fechaNacimiento=").append(fechaNacimiento);
        sb.append(", sueldo=").append(sueldo);
        sb.append(", genero=").append(genero);
        sb.append(", usuario=").append(usuario);
        sb.append(", direccion=").append(direccion);
        sb.append("]");
        return sb.toString();
    }
}
