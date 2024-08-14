using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AppInsightsDemo.Models

{
    public class Student
    {
        [Key]
        public int Id
        {
            get;
            set;
        }
        public string? Name
        {
            get;
            set;
        }
        public string? Address
        {
            get;
            set;
        }
        public string? Email
        {
            get;
            set;
        }
        public string? City
        {
            get;
            set;
        }
        public string? State
        {
            get;
            set;
        }
        public string? Country
        {
            get;
            set;
        }
        public int? Age
        {
            get;
            set;
        }
        public DateTime? BirthDate
        {
            get;
            set;
        }
    }

}
