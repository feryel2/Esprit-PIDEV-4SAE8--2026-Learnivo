# Frontend Setup and Usage

This Angular project (`frontend-v21`) provides a full CRUD UI for backend resources defined by the Spring Boot API at `http://localhost:8080`.

## Running the Application

1. **Start backend**: ensure the Spring Boot server is running on port `8080` (default). The frontend uses a relative `/api` path which is proxied to the backend via `environment.apiBaseUrl`.

2. **Install dependencies** (once):
   ```bash
   cd TEMPLATE-PI-main
   npm install
   ```

3. **Build styles**: Tailwind runs automatically before start/build via `prestart`/`prebuild` scripts.

4. **Run frontend (development)**:
   ```bash
   npm start
   ```
   The app will be served at `http://localhost:4200`.

5. **Production build**:
   ```bash
   npm run build
   ```
   Output will be placed in `dist/frontend-v21`.

> If you encounter CORS errors when running against the backend, you can create a proxy configuration. Add `proxy.conf.json` to the project with:
>
> ```json
> {
>   "/api": {
>     "target": "http://localhost:8080",
>     "secure": false,
>     "changeOrigin": true
>   }
> }
> ```
>
> and update `start` script to `ng serve --proxy-config proxy.conf.json`. No backend changes are required.

## API Configuration

- Base URL: configured via `src/environments/environment.ts` (and `.prod.ts`).
- HTTP interceptor (`api/api.interceptor.ts`) prepends the `apiBaseUrl` and handles errors globally.

## Routes Overview

### Public Pages
- `/` – About
- `/trainings` – Trainings list
- `/trainings/:slug` – Training detail
- `/trainings/:slug/:chapterId` – Chapter detail
- `/clubs` – Clubs list
- `/clubs/:slug` – Club detail
- `/events` – Events list
- `/events/:slug` – Event detail
- `/competitions` – Competitions list
- `/competitions/:slug` – Competition detail
- `/classes` – Classes list
- `/certificate` – Certificate page

### Admin Pages (`/admin` section)
- `/admin` – Dashboard
- `/admin/trainings` – Training management (existing template)
- `/admin/clubs` – Club management
- `/admin/events` – Event CRUD
- `/admin/competitions` – Competition management
- `/admin/classes` – Class management
- `/admin/offers` – Internship offers CRUD
- `/admin/internships` – Internships CRUD
- `/admin/certification-rules` – Certification rules CRUD
- `/admin/certificates` – Certificates CRUD
- `/admin/applications` – Internship applications CRUD
- `/admin/evaluations` – Internship evaluations CRUD
- `/admin/documents` – Internship documents CRUD

## Testing CRUD Flows

1. Use the Admin sidebar to navigate to a resource.
2. Click "Add New" to create an item. Fill required fields and save.
3. The list updates automatically.
4. Use edit and delete buttons to modify or remove records.
5. All operations are executed against the backend via the OpenAPI-defined endpoints and verified by consuming the `/api/*` REST API.

> For quick smoke tests, you can also open browser devtools network tab to inspect requests going to the backend.

## Verification Commands

Run the following to confirm the workspace is healthy:

```bash
npm run build
npm test   # runs unit tests if configured
npm run lint  # lint if configured
```

## Notes

- Models and services were generated based on the backend OpenAPI spec (`http://localhost:8080/v3/api-docs`).
- All new components are standalone and import required Angular modules locally.
- Reactive forms provide validation and typed DTOs.
- Global error handling via interceptor shows basic alerts; can be replaced with a toast component.

---

_End of setup guide._