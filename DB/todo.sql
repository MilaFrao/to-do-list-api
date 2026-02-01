-- Active: 1769915241478@@127.0.0.1@5432@todo_bd@public

CREATE TABLE usuarios(
    id integer NOT NULL,
    nombre varchar(150) NOT NULL,
    email varchar(150) NOT NULL,
    contrasena varchar(250) NOT NULL,
    fecha_registro timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id)
);
CREATE UNIQUE INDEX usuarios_email_key ON public.usuarios USING btree (email);

CREATE TABLE tareas(
    id integer NOT NULL,
    titulo varchar(150) NOT NULL,
    descripcion text,
    story_points integer,
    fecha_entrega date,
    estado varchar(30) DEFAULT 'pendiente'::character varying,
    id_creador integer NOT NULL,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id),
    CONSTRAINT fk_tarea_creador FOREIGN key(id_creador) REFERENCES usuarios(id),
    CONSTRAINT tareas_story_points_check CHECK (story_points >= 0)
);

CREATE TABLE tarea_posee_categoria(
    id_tarea integer NOT NULL,
    id_categoria integer NOT NULL,
    PRIMARY KEY(id_tarea,id_categoria),
    CONSTRAINT fk_tc_tarea FOREIGN key(id_tarea) REFERENCES tareas(id),
    CONSTRAINT fk_tc_categoria FOREIGN key(id_categoria) REFERENCES categorias(id)
);

CREATE TABLE tarea_asigna_usuario(
    id_tarea integer NOT NULL,
    id_usuario integer NOT NULL,
    PRIMARY KEY(id_tarea,id_usuario),
    CONSTRAINT fk_tu_tarea FOREIGN key(id_tarea) REFERENCES tareas(id),
    CONSTRAINT fk_tu_usuario FOREIGN key(id_usuario) REFERENCES usuarios(id)
);

CREATE TABLE comentarios(
    id integer NOT NULL,
    contenido text NOT NULL,
    fecha_comentario timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    id_usuario integer NOT NULL,
    id_tarea integer NOT NULL,
    CONSTRAINT fk_comentario_usuario FOREIGN key(id_usuario) REFERENCES usuarios(id),
    CONSTRAINT fk_comentario_tarea FOREIGN key(id_tarea) REFERENCES tareas(id)
);

CREATE TABLE categorias(
    id integer NOT NULL,
    nombre varchar(150) NOT NULL,
    descripcion varchar(250),
    color varchar(100) NOT NULL,
    PRIMARY KEY(id)
);