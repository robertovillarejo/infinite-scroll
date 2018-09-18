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
package com.example.service.impl;

import com.example.domain.Direccion;
import com.example.repository.DireccionRepository;
import com.example.service.DireccionService;

import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import mx.infotec.dads.kukulkan.tables.apachepoi.SheetDataSupplier;
import mx.infotec.dads.kukulkan.tables.apachepoi.WorkbookWriter;

/**
 * DireccionServiceImpl
 * 
 * @author kukulkan
 * @kukulkanGenerated 20180809165807
 */
@Service
@Transactional
public class DireccionServiceImpl implements DireccionService {

    private final Logger log = LoggerFactory.getLogger(DireccionServiceImpl.class);

    @Autowired
    private DireccionRepository repository;

    @Override
    @Transactional(readOnly = true)
    public Page<Direccion> findAll(Pageable pageable) {
        log.debug("Request to get all Direccion");
        return repository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Direccion findById(Long id) {
        log.debug("Request to get Direccion : {}", id);
        return repository.findOne(id);
    }

    @Override
    public Direccion save(Direccion direccion) {
        return repository.save(direccion);
    }

    @Override
    public boolean exists(Long id) {
        return repository.exists(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Direccion : {}", id);
        repository.delete(id);
    }

    @Override
    public void deleteAll() {
        log.debug("Request to delete All Direccion");
        repository.deleteAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Direccion> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of Direccion ");
        return repository.findAll(pageable);
    }

    @Override
    public SXSSFWorkbook getWorkbook() {
        log.debug("Request to get a Workbook of Persona ");
        SheetDataSupplier<Direccion> dataSupplier = new SheetDataSupplier<>((Pageable pageable) -> {
            return repository.findAll(pageable);
        });
        WorkbookWriter<Direccion> converter = new WorkbookWriter<>(Direccion.class);
        converter.addData(dataSupplier);
        return converter.getWorkbook();
    }
}
