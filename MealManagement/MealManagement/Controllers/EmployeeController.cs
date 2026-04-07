using MealManagement.Data;
using MealManagement.DTOs;
using MealManagement.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MealManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private readonly MealManagerDbContext _context;

        public EmployeeController(MealManagerDbContext context)
        {
            _context = context;
        }

        // 🔹 REGISTER
        [HttpPost("Register")]
        public IActionResult Register(EmployeeDto dto)
        {
            if (_context.Employees.Any(e => e.FullName == dto.FullName))
                return BadRequest("Employee already exists");

            var employee = new Employee
            {
                FullName = dto.FullName,
                Password = dto.Password
            };

            _context.Employees.Add(employee);
            _context.SaveChanges();

            return Ok("Registered Successfully");
        }

        // ✅ LOGIN
        [HttpPost("Login")]
        public IActionResult Login(LoginDto dto)
        {
            var employee = _context.Employees
                .FirstOrDefault(e =>
                    e.FullName == dto.FullName &&
                    e.Password == dto.Password);

            if (employee == null)
                return Unauthorized("Invalid credentials");

            return Ok(employee);
        }

        [HttpPost("Add")]
        public IActionResult AddEmployee(EmployeeDto dto)
        {
            var employee = new Employee
            {
                FullName = dto.FullName,
                Password = dto.Password
            };

            _context.Employees.Add(employee);
            _context.SaveChanges();

            return Ok(employee);
        }

        [HttpGet("All")]
        public IActionResult GetAllEmployees()
        {
            var employees = _context.Employees.ToList();
            return Ok(employees);
        }

        [HttpGet("{id}")]
        public IActionResult GetEmployee(int id)
        {
            var employee = _context.Employees.Find(id);

            if (employee == null)
                return NotFound("Employee Not Found");

            return Ok(employee);
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteEmployee(int id)
        {
            var employee = _context.Employees.Find(id);

            if (employee == null)
                return NotFound("Employee Not Found");

            _context.Employees.Remove(employee);
            _context.SaveChanges();

            return Ok("Employee Deleted");
        }
        [HttpPut("Update/{id}")]
        public IActionResult UpdateEmployee(int id, UpdateEmployeeDto dto)
        {
            var employee = _context.Employees.Find(id);

            if (employee == null)
                return NotFound("Employee not found");

            employee.FullName = dto.FullName;

            _context.SaveChanges();

            return Ok(employee);
        }
    }
}