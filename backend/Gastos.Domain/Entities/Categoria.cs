using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Gastos.Domain.Enums;

namespace Gastos.Domain.Entities
{
    public class Categoria
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required(ErrorMessage = "A descrição é obrigatória.")]
        [MaxLength(400, ErrorMessage = "A descrição não pode exceder 400 caracteres.")]
        public string Descricao { get; set; } = string.Empty;

        [Required]
        public Finalidade Finalidade { get; set; }
    }
}