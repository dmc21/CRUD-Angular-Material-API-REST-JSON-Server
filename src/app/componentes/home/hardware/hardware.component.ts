import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';

import { HardwareService } from '../../../servicios/hardware.service';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';

export interface Hardware {
  id: string;
  nombre: string;
  categoria: string;
}

@Component({
  selector: 'app-hardware',
  templateUrl: 'hardware.component.html',
  styleUrls: ['./hardware.component.css']
})
export class HardwareComponent implements OnInit {
  dataSource: MatTableDataSource<Hardware>;
  displayedColumns: string[] = ['id', 'nombre', 'categoria'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  hardwareList: Hardware[];
  insertarForm: FormGroup;

  product = ({
    id: '',
    nombre: '',
    categoria: ''
  });

  mensajeButton: string = "Insertar producto";
  borrarButton: string = "Restablecer";

  constructor(private hardService: HardwareService, private fb: FormBuilder) {
    
  }

  ngOnInit() {
    this.hardService.getAll().subscribe(data =>{
          this.hardwareList = data;
          this.dataSource = new MatTableDataSource(this.hardwareList);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
    });
    
    this.limpiaForm();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  edit(producto){
    this.product = ({
      id: producto.id,
      nombre: producto.nombre,
      categoria: producto.categoria
    });

    this.insertarForm = this.fb.group({
      id: [producto.id],
      nombre: [producto.nombre],
      categoria: [producto.categoria]
    });

    this.mensajeButton = "Editar";
  }


  delete(id){
    if(id > 0){
    let c = confirm('¿Seguro que quieres eliminar el producto '+id+"?");
    if(c){
      this.hardService.removeProduct(id).subscribe(data =>{
        this.hardService.getAll().subscribe(data =>{
          this.hardwareList = data;
          this.dataSource = new MatTableDataSource(this.hardwareList);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.mensajeButton = "Insertar producto";
    }); 
      });

      this.product.id = '';
      this.limpiaForm();
    }
    }else{
      alert('NO ESTAS EDITANDO');
    }
  }



  insert(){
    if(this.insertarForm.get('id').value.length == 0){
    this.hardService.insertProduct(this.insertarForm.value as Hardware).subscribe(data =>{
      this.hardwareList.push(data);
      this.dataSource = new MatTableDataSource(this.hardwareList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort; 
    });
  }else{
    this.hardService.updateProduct(this.insertarForm.value as Hardware).subscribe(data =>{
      this.hardService.getAll().subscribe(data =>{
        this.hardwareList = data;
        this.dataSource = new MatTableDataSource(this.hardwareList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.mensajeButton = "Insertar producto";
  }); 
    });
  }
    this.limpiaForm();
  }



  limpiaForm(){
    this.insertarForm = this.fb.group({
      id: [''],
      nombre: ['',[Validators.required]],
      categoria: ['',[Validators.required]]
    });
  }

}