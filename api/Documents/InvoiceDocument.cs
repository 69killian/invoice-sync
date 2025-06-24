using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using api.Models;

namespace api.Documents;

public class InvoiceDocument : IDocument
{
    private readonly Invoice _invoice;

    public InvoiceDocument(Invoice invoice)
    {
        _invoice = invoice ?? throw new ArgumentNullException(nameof(invoice));
        if (invoice.Client is null) throw new ArgumentException("Invoice must have a client", nameof(invoice));
        if (invoice.Services is null) throw new ArgumentException("Invoice must have services", nameof(invoice));
    }

    public DocumentMetadata GetMetadata() => DocumentMetadata.Default;

    public void Compose(IDocumentContainer container)
    {
        container.Page(page =>
        {
            page.Margin(50);

            page.Header().Element(ComposeHeader);
            page.Content().Element(ComposeContent);
            page.Footer().Element(ComposeFooter);
        });
    }

    private void ComposeHeader(IContainer container)
    {
        container.Row(row =>
        {
            row.RelativeItem().Column(column =>
            {
                column.Item().Text($"FACTURE #{_invoice.InvoiceNumber}")
                    .FontSize(20)
                    .Bold();
                column.Item().Text($"Date : {_invoice.DateIssued:dd/MM/yyyy}");
                if (_invoice.DueDate.HasValue)
                {
                    column.Item().Text($"Date d'échéance : {_invoice.DueDate.Value:dd/MM/yyyy}");
                }
            });
        });
    }

    private void ComposeContent(IContainer container)
    {
        if (_invoice.Client is null) return;

        container.Column(column =>
        {
            // Information client
            column.Item().PaddingVertical(10).Column(column =>
            {
                column.Item().Text("Client").Bold();
                column.Item().Text(_invoice.Client.Name);
                if (!string.IsNullOrEmpty(_invoice.Client.Email))
                    column.Item().Text(_invoice.Client.Email);
                if (!string.IsNullOrEmpty(_invoice.Client.Phone))
                    column.Item().Text(_invoice.Client.Phone);
            });

            // Tableau des services
            if (_invoice.Services?.Any() == true)
            {
                column.Item().PaddingVertical(10).Table(table =>
                {
                    // En-têtes
                    table.ColumnsDefinition(columns =>
                    {
                        columns.RelativeColumn(3);
                        columns.RelativeColumn();
                        columns.RelativeColumn();
                        columns.RelativeColumn();
                    });

                    table.Header(header =>
                    {
                        header.Cell().Background("#F3F4F6").Padding(5).Text("Service").Bold();
                        header.Cell().Background("#F3F4F6").Padding(5).Text("Prix unitaire").Bold();
                        header.Cell().Background("#F3F4F6").Padding(5).Text("Quantité").Bold();
                        header.Cell().Background("#F3F4F6").Padding(5).Text("Total").Bold();
                    });

                    // Lignes de services
                    foreach (var service in _invoice.Services.Where(s => s.Service != null))
                    {
                        table.Cell().BorderBottom(1).BorderColor("#E5E7EB").Padding(5).Text(service.Service.Name);
                        table.Cell().BorderBottom(1).BorderColor("#E5E7EB").Padding(5).Text($"{service.UnitPrice:C2}");
                        table.Cell().BorderBottom(1).BorderColor("#E5E7EB").Padding(5).Text(service.Quantity.ToString());
                        table.Cell().BorderBottom(1).BorderColor("#E5E7EB").Padding(5).Text($"{service.Subtotal:C2}");
                    }
                });
            }

            // Résumé des totaux
            column.Item().PaddingTop(10).Column(column =>
            {
                column.Item().AlignRight().Text($"Total HT : {_invoice.TotalExclTax:C2}");
                column.Item().AlignRight().Text($"TVA (20%) : {(_invoice.TotalInclTax - _invoice.TotalExclTax):C2}");
                column.Item().AlignRight().Text($"Total TTC : {_invoice.TotalInclTax:C2}").Bold();
            });

            // Modalités de paiement
            column.Item().PaddingTop(20).Column(column =>
            {
                column.Item().Text("Modalités de paiement").Bold();
                column.Item().Text("Le paiement est dû dans les 30 jours suivant la date de facturation.");
                column.Item().Text("Modes de paiement acceptés :");
                column.Item().Text("- Virement bancaire");
                column.Item().Text("- Carte bancaire");
                column.Item().Text("- Chèque");
                
                if (_invoice.DueDate.HasValue)
                {
                    column.Item().PaddingTop(5).Text($"Date limite de paiement : {_invoice.DueDate.Value:dd/MM/yyyy}").Bold();
                }
            });

            // Conditions générales
            column.Item().PaddingTop(20).Column(column =>
            {
                column.Item().Text("Conditions générales").Bold();
                column.Item().Text("1. Les services fournis sont soumis aux conditions générales de vente disponibles sur demande.");
                column.Item().Text("2. Tout retard de paiement entraînera des pénalités de retard calculées sur la base de trois fois le taux d'intérêt légal.");
                column.Item().Text("3. Une indemnité forfaitaire de 40€ pour frais de recouvrement sera due en cas de retard de paiement (articles L.441-6 et D.441-5 du Code de commerce).");
            });

            // Mentions légales
            column.Item().PaddingTop(20).Column(column =>
            {
                column.Item().Text("Mentions légales").Bold();
                column.Item().Text("TVA intracommunautaire : FR XX XXX XXX XXX");
                column.Item().Text("SIRET : XXX XXX XXX XXXXX");
                column.Item().Text("En cas de retard de paiement, application des pénalités de retard au taux annuel de 15%");
                column.Item().Text("Pas d'escompte en cas de paiement anticipé");
            });

            // Remerciements
            column.Item().PaddingTop(20).Column(column =>
            {
                column.Item().AlignCenter().Text("Nous vous remercions de votre confiance").Italic();
                column.Item().AlignCenter().Text("Pour toute question concernant cette facture, n'hésitez pas à nous contacter").Italic();
            });
        });
    }

    private void ComposeFooter(IContainer container)
    {
        container.Row(row =>
        {
            row.RelativeItem().Column(column =>
            {
                column.Item().Text(text =>
                {
                    text.Span("Page ").FontSize(10);
                    text.CurrentPageNumber().FontSize(10);
                    text.Span(" sur ").FontSize(10);
                    text.TotalPages().FontSize(10);
                });
            });

            row.RelativeItem().Column(column =>
            {
                column.Item().AlignRight().Text("Document généré automatiquement - Ne nécessite pas de signature").FontSize(8).Italic();
            });
        });
    }

    public byte[] GeneratePdf()
    {
        return Document.Create(container => Compose(container)).GeneratePdf();
    }
} 