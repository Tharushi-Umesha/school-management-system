from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import all routers
from routers import students, teachers, events, attendance, auth

app = FastAPI()

# CORS config
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all routes
app.include_router(students.router)
app.include_router(teachers.router)
app.include_router(events.router)
app.include_router(attendance.router)  # ✅ This must be here!
app.include_router(auth.router)
