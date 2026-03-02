using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MealManagement.Data;
using MealManagement.Models;
using MealManagement.DTOs;

namespace MealManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MealController : ControllerBase
    {
        private readonly MealManagerDbContext _context;

        public MealController(MealManagerDbContext context)
        {
            _context = context;
        }

        // ✅ Add Meal (Only once per day per meal)
        [HttpPost("Add")]
        public IActionResult AddMeal(AddMealDto dto)
        {
            var today = DateTime.Today;

            // Check employee exists
            var employeeExists = _context.Employees
                .Any(e => e.EmployeeId == dto.EmployeeId);

            if (!employeeExists)
                return BadRequest("Invalid Employee");

            // Check meal type exists
            var mealTypeExists = _context.MealTypes
                .Any(m => m.MealTypeId == dto.MealTypeId);

            if (!mealTypeExists)
                return BadRequest("Invalid Meal Type");

            // Prevent duplicate meal marking
            var exists = _context.MealRecords.Any(m =>
                m.EmployeeId == dto.EmployeeId &&
                m.MealTypeId == dto.MealTypeId &&
                m.MealDate == today);

            if (exists)
                return BadRequest("Meal already marked for today.");

            var meal = new MealRecord
            {
                EmployeeId = dto.EmployeeId,
                MealTypeId = dto.MealTypeId,
                MealDate = today
            };

            _context.MealRecords.Add(meal);
            _context.SaveChanges();

            return Ok("Meal Added Successfully");
        }

        // ✅ Today's total plates (All Employees)
        [HttpGet("TodayPlates")]
        public IActionResult GetTodayPlates()
        {
            var today = DateTime.Today;

            var total = _context.MealRecords
                .Count(m => m.MealDate == today);

            return Ok(total);
        }

        // ✅ Employee Total Plates
        [HttpGet("TotalPlates/{employeeId}")]
        public IActionResult GetTotalPlates(int employeeId)
        {
            var total = _context.MealRecords
                .Count(m => m.EmployeeId == employeeId);

            return Ok(total);
        }
        [HttpGet("TotalAmount/{employeeId}")]
        public IActionResult GetTotalAmount(int employeeId)
        {
            var total = _context.MealRecords
                .Where(r => r.EmployeeId == employeeId)
                .Sum(r => (decimal?)r.MealType.FixedPrice) ?? 0;

            return Ok(total);
        }

        // ✅ Admin Filtered History (Date Range + Search)
        [HttpPost("FilteredHistory")]
        public IActionResult GetFilteredHistory(HistoryFilterDto dto)
        {
            if (dto.AdminPassword != "admin123")
                return Unauthorized("Wrong Admin Password");

            var query = _context.MealRecords
                .Include(r => r.Employee)
                .Include(r => r.MealType)
                .Where(r => r.MealDate >= dto.FromDate &&
                            r.MealDate <= dto.ToDate);

            if (!string.IsNullOrEmpty(dto.Name))
            {
                query = query.Where(r =>
                    r.Employee.FullName.Contains(dto.Name));
            }

            var result = query
                .Select(r => new
                {
                    EmployeeName = r.Employee.FullName,
                    MealName = r.MealType.MealName,
                    Date = r.MealDate,
                    Price = r.MealType.FixedPrice
                })
                .ToList();

            return Ok(result);
        }
    }
}