-- Active: 1768314161089@@127.0.0.1@5432@base_de_datos_todo@public

CREATE TABLE usuarios(
    id SERIAL NOT NULL,
    nombre varchar(150) NOT NULL,
    email varchar(150) NOT NULL,
    contrasena varchar(250) NOT NULL,
    fecha_de_registro timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id)
);
CREATE UNIQUE INDEX usuarios_email_key ON public.usuarios USING btree (email);

CREATE TABLE tareas(
    id SERIAL NOT NULL,
    titulo varchar(150) NOT NULL,
    descripcion text,
    story_points integer,
    fecha_entrega date,
    estado varchar(30) DEFAULT 'pendiente'::character varying,
    id_creador integer NOT NULL,
    id_asignado integer,
    id_categorias integer,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id),
    CONSTRAINT fk_creador FOREIGN key(id_creador) REFERENCES usuarios(id),
    CONSTRAINT fk_asignado FOREIGN key(id_asignado) REFERENCES usuarios(id),
    CONSTRAINT fk_categorias FOREIGN key(id_categorias) REFERENCES categorias(id),
    CONSTRAINT tareas_story_points_check CHECK (story_points >= 0)
);

CREATE TABLE comentarios(
    id SERIAL NOT NULL,
    contenido text NOT NULL,
    fecha_comentario timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    id_usuario integer NOT NULL,
    id_tarea integer NOT NULL,
    PRIMARY KEY(id),
    CONSTRAINT fk_comentario_de_usuario FOREIGN key(id_usuario) REFERENCES usuarios(id),
    CONSTRAINT fk_tarea_comentada FOREIGN key(id_tarea) REFERENCES tareas(id)
);

CREATE TABLE categorias(
    id SERIAL NOT NULL,
    nombre varchar(150) NOT NULL,
    descripcion varchar(250),
    color varchar(50) NOT NULL,
    PRIMARY KEY(id)
);
