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

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Optional;

import org.apache.poi.ss.usermodel.Workbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.SliceImpl;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.domain.Persona;
import com.example.repository.PersonaRepository;
import com.example.service.PersonaService;

import mx.infotec.dads.kukulkan.tables.apachepoi.PojoToXlsxConverter;
import mx.infotec.dads.kukulkan.tables.apachepoi.SheetDataSupplier;
import mx.infotec.dads.kukulkan.tables.handsontable.Handsontable;
import mx.infotec.dads.kukulkan.tables.handsontable.HandsontableFactory;
import mx.infotec.dads.kukulkan.tables.handsontable.HandsontableSlice;

/**
 * PersonaServiceImpl
 * 
 * @author kukulkan
 * @kukulkanGenerated 20180809165807
 */
@Service
@Transactional
public class PersonaServiceImpl implements PersonaService {

    private final Logger log = LoggerFactory.getLogger(PersonaServiceImpl.class);

    @Autowired
    private PersonaRepository repository;

    @Override
    @Transactional(readOnly = true)
    public Page<Persona> findAll(Pageable pageable) {
        log.debug("Request to get all Persona");
        return repository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Persona findById(Long id) {
        log.debug("Request to get Persona : {}", id);
        return repository.findOne(id);
    }

    @Override
    public Persona save(Persona persona) {
        return repository.save(persona);
    }

    @Override
    public boolean exists(Long id) {
        return repository.exists(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Persona : {}", id);
        repository.delete(id);
    }

    @Override
    public void deleteAll() {
        log.debug("Request to delete All Persona");
        repository.deleteAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Persona> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of Persona ");
        return repository.findAll(pageable);
    }

    @Override
    public HandsontableSlice<Persona> getHandsontable(Pageable pageable) {
        log.debug("Request to get a Handsontable of Persona ");
        Handsontable<Persona> table = HandsontableFactory.createHandsontable(Persona.class);
        // Should create add a method in repository that returns a Slice instead use a
        // Page
        Page<Persona> page = repository.findAll(pageable);
        Slice<Persona> slice = new SliceImpl<>(page.getContent(), pageable, page.hasNext());
        return new HandsontableSlice<>(table, slice);
    }

    @Override
    public Optional<File> getWorkbook() {
        log.debug("Request to get a Workbook of Persona ");
        SheetDataSupplier<Persona> dataSupplier = new SheetDataSupplier<>((Pageable pageable) -> {
            return repository.findAll(pageable);
        });
        PojoToXlsxConverter<Persona> converter = new PojoToXlsxConverter<>(Persona.class, dataSupplier);
        Workbook wb = converter.getWorkbook();
        try {
            Path path = Files.createTempFile("kukulkan", "workbook");
            File file = path.toFile();
            FileOutputStream outputStream = new FileOutputStream(path.toFile());
            wb.write(outputStream);
            outputStream.close();
            wb.close();
            return Optional.of(file);
        } catch (IOException e) {
            return Optional.empty();
        }
    }
}
