# Examen 2do Parcial

Este proyecto es una aplicación de gestión para una bodega

## Tecnologías utilizadas

- React.js
- Supabase

## Configuración de Supabase

1. Crea una cuenta en Supabase.
2. Crea un nuevo proyecto.
3. En la Configuracion del proyecto seccion "tus apps" obtener las variables `URL` y `KEY` con los valores proporcionados por Supabase.
5. Implementar las siguientes tablas

```
   create table
  public.producto (
    idproducto serial,
    nombre character varying(125) not null,
    categoria character varying(125) not null,
    created_at timestamp with time zone null default current_timestamp,
    updated_at timestamp with time zone null default current_timestamp,
    stock integer null,
    precio double precision null,
    constraint producto_pkey primary key (idproducto)
  ) tablespace pg_default;

create trigger update_modtime before
update on producto for each row
execute function update_modified_column ();
```

```
    create table
  public.transaccion (
    idtransaccion serial,
    accion character varying(125) not null,
    producto character varying(125) not null,
    created_at timestamp with time zone null default current_timestamp,
    updated_at timestamp with time zone null default current_timestamp,
    cantidad integer null,
    categoria character varying(125) null,
    constraint transaccion_pkey primary key (idtransaccion)
  ) tablespace pg_default;

create trigger update_modtime before
update on transaccion for each row
execute function update_modified_column ();
```

```
    create table
  public.venta (
    idventa serial,
    producto integer not null,
    created_at timestamp with time zone null default current_timestamp,
    updated_at timestamp with time zone null default current_timestamp,
    cantidad integer null,
    constraint venta_pkey primary key (idventa),
    constraint venta_producto_fkey foreign key (producto) references producto (idproducto)
  ) tablespace pg_default;

create trigger update_modtime before
update on venta for each row
execute function update_modified_column ();
```	  

## Como correr el programa

1. Crear el archivo .env a la altura de la raiz del proyecto con el siguiente formato y colocar sus variables
```
      VITE_REACT_APP_SUPABASE_URL=
      VITE_REACT_APP_SUPABASE_ANON_KEY=
```	
      
2. Ingresar a la terminal del proyecto y correr el siguiente codigo para actualizar lo paquetes
```
    npm i
```

3. En la misma terminal correr el siguiente codigo para inciar el proyecto
```
    npm run dev
```


## Autores

Carol Jacome - Steven Oviedo 

DIEGO MEDARDO SAAVEDRA GARCIA "statick88" (Codigo Original)
