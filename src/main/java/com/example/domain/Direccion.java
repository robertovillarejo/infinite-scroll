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

import javax.persistence.*;

import mx.infotec.dads.kukulkan.tables.annotations.Sheet;
import mx.infotec.dads.kukulkan.tables.annotations.SheetColumn;

import java.util.Objects;
import java.io.Serializable;

/**
 * The Direccion
 * 
 * @author kukulkan
 *
 */
@Sheet
@Entity
@Table(name = "direcciones")
public class Direccion implements Serializable {

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

    @SheetColumn
    @Column(name = "calle", nullable = true)
    private String calle;

    @SheetColumn
    @Column(name = "numero", nullable = true)
    private int numero;

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
     * @return the calle
     */
    public String getCalle() {
        return calle;
    }

    /**
     * @param calle
     *            the calle to set
     */
    public void setCalle(String calle) {
        this.calle = calle;
    }

    /**
     * @return the numero
     */
    public int getNumero() {
        return numero;
    }

    /**
     * @param numero
     *            the numero to set
     */
    public void setNumero(int numero) {
        this.numero = numero;
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
        sb.append(", calle=").append(calle);
        sb.append(", calle=").append(numero);
        sb.append("]");
        return sb.toString();
    }
}
