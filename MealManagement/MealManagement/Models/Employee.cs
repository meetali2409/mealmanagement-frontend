using MealManagement.Models;
using System.ComponentModel.DataAnnotations;

namespace MealManagement.Models
{
    public class Employee
    {
        [Key]
        public int EmployeeId { get; set; }
        [Required]
        public string FullName { get; set; }
        [Required]
        public string Password { get; set; }

        public ICollection<MealRecord>? MealRecords { get; set; }
    }
}