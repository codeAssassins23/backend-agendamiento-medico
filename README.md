# Sistema de Agendamiento de Citas Médicas

Este proyecto implementa un **backend serverless en AWS** para gestionar el **agendamiento de citas médicas** en dos países: **Perú (PE)** y **Chile (CL)**.

La aplicación fue desarrollada con **Node.js (TypeScript)** y **Serverless Framework**, siguiendo **arquitectura limpia (Clean Architecture)** y principios **SOLID**.

---

## Flujo de la aplicación

1. **Agendamiento (POST /appointments)**

   - El Lambda `createAppointment` guarda la cita en **DynamoDB** con estado `pending`.
   - Publica un mensaje en **SNS**, que redirige al **SQS** correspondiente (`PE` o `CL`).

2. **Procesamiento (Consumers PE/CL)**

   - El Lambda `appointmentConsumerPE` o `appointmentConsumerCL` lee de SQS.
   - Inserta/actualiza la cita en el **RDS MySQL** del país correspondiente.
   - Publica un evento en **EventBridge** indicando `COMPLETED`.

3. **Actualización de estado (statusConsumer)**

   - El Lambda `statusConsumer` lee el evento desde SQS.
   - Actualiza el estado de la cita en **DynamoDB** a `completed`.

4. **Consulta (GET /appointments/{insuredId})**
   - Permite obtener todas las citas de un asegurado y sus estados.

---

## Requisitos Previos

- Node.js v18+
- AWS CLI configurado con perfil autorizado
- Serverless Framework (`npm install -g serverless`)

---

## Tecnologías Utilizadas

- **Lenguaje:** TypeScript (Node.js)
- **Framework:** Serverless Framework
- **Arquitectura:** Hexagonal (Ports & Adapters)
- **Base de Datos:**
  - RDS MySQL (por región: CL y PE)
  - DynamoDB (almacenamiento rápido de citas)
- **Mensajería & Eventos:**
  - AWS SQS (colas de entrada)
  - AWS SNS (notificaciones de salida)
  - AWS EventBridge (eventos del dominio)

---

## Servicios AWS utilizados

- **API Gateway HTTP** → expone los endpoints REST.
- **Lambda** → lógica de negocio.
- **DynamoDB** → almacenamiento inicial de citas.
- **SNS + SQS** → distribución de mensajes por país.
- **RDS MySQL** → persistencia final de citas en la base de datos de cada país.
- **EventBridge** → publicación de eventos `AppointmentCompleted`.
- **SQS (status)** → asegura la confirmación y actualización final en DynamoDB.
- **VPC Endpoints** → permiten que las Lambdas en subnets privadas hablen con EventBridge.
- **Security Groups** → separan tráfico PE y CL, habilitando solo los puertos necesarios (3306 para MySQL, 443 para EventBridge).

---

## Estructura del proyecto

```bash
├── .env # Variables de entorno (MySQL, SG, Subnets, DynamoDB, etc.)
├── .gitignore # Ignora node_modules, builds y secretos
├── jest.config.ts # Configuración de Jest para pruebas unitarias
├── openapi.yaml # Definición OpenAPI/Swagger de los endpoints
├── package-lock.json
├── package.json
├── serverless.yml # Configuración Serverless Framework (Lambdas, permisos, VPC)
├── tsconfig.json # Configuración de TypeScript
│
├── events/ # Eventos JSON de ejemplo para pruebas locales
│ ├── sqs-cl.json
│ ├── sqs-pe.json
│ └── status.json
│
├── src/
│ ├── application/ # Casos de uso: orquestan la lógica de negocio
│ │ └── use-cases/
│ │ └── appointments/
│ │ ├── createAppointment.usecase.ts # Crear cita (POST)
│ │ ├── listAppointments.usecase.ts # Listar citas (GET)
│ │ ├── markAppointmentCompleted.usecase.ts # Marcar cita completada
│ │ ├── processAppointmentCL.usecase.ts # Procesar cita CL
│ │ └── processAppointmentPE.usecase.ts # Procesar cita PE
│ │
│ ├── domain/ # Núcleo de negocio (entidades y contratos)
│ │ ├── entities/
│ │ │ └── appointment.ts # Entidad Appointment
│ │ └── ports/
│ │ ├── appointment.repository.ts # Contrato repositorio general
│ │ ├── appointmentCountry.repository.ts # Contrato repositorio por país
│ │ └── eventPublisher.ts # Contrato publicador de eventos
│ │
│ ├── functions/ # Handlers de AWS Lambda (entrypoints)
│ │ ├── appointments/
│ │ │ ├── createAppointment.ts # POST /appointments
│ │ │ └── getByInsuredAppointments.ts # GET /appointments/{insuredId}
│ │ ├── consumers/
│ │ │ ├── appointment_cl.ts # Consumer SQS CL
│ │ │ └── appointment_pe.ts # Consumer SQS PE
│ │ └── status/
│ │ └── onMessage.ts # Consumer status (EventBridge → SQS)
│ │
│ └── infrastructure/ # Adaptadores concretos (implementaciones técnicas)
│ ├── config/
│ │ ├── ddb/
│ │ │ └── dynamo.ts # Cliente DynamoDB
│ │ ├── envs/
│ │ │ ├── envs.cl.ts # Variables específicas de CL
│ │ │ ├── envs.common.ts # Configuración común
│ │ │ └── envs.pe.ts # Variables específicas de PE
│ │ └── rds/
│ │ ├── mysql.cl.ts # Pool MySQL CL
│ │ └── mysql.pe.ts # Pool MySQL PE
│ ├── messaging/
│ │ ├── eventbridge.ts # Publicador a EventBridge
│ │ └── sns.ts # Publicador a SNS
│ └── repos/
│ ├── appointment-cl.repo.ts # Repositorio MySQL CL
│ ├── appointment-pe.repo.ts # Repositorio MySQL PE
│ └── appointment.repository.ts # Repositorio DynamoDB
│
└── tests/ # Pruebas unitarias con Jest
├── appointment_pe.test.ts
├── createAppointment.test.ts
└── getByInsuredAppointments.test.ts
```

---

## Pruebas Locales

Para iniciar la app en entorno local ejecuta: npm run dev

### Ejecutar pruebas unitarias con Jest

```bash
npm run test
```

Para probar el comportamiento de los consumidores de eventos en tu entorno local, ejecuta:

### -Consumer de citas PE

```bash
npx serverless invoke local -f appointmentConsumerPE --path events/sqs-pe.json
```

### -Consumer de citas CL

```bash
npx serverless invoke local -f appointmentConsumerCL --path events/sqs-cl.json
```

### -Consumer de cambios de estado

```bash
npx serverless invoke local -f statusConsumer --path events/status.json
```

### Despliegue

Para desplegar la solución en AWS:

```bash
npm install
npm run deploy
```

---

### Despliegue

Este proyecto fue desplegado con **Serverless Framework** sobre **AWS Lambda**, utilizando servicios nativos como **API Gateway, SNS, SQS, DynamoDB y RDS MySQL**.

## Documentación SwaggerHub

Consulta y prueba la API desde la documentación generada automáticamente:

[Ver documentación SwaggerHub](https://app.swaggerhub.com/apis-docs/developersbravo/appointments-api/1.0.0)
