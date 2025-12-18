function verifierDonneesAnormales(feu) {

  if (isShuttingDown) return null;

  const feuId = feu.id || feu.ID;
  const anomaliesCourantes = new Set();


  if ((feu.tension_service && feu.tension_service.includes('5V')) ||
      (feu.Tension_service && feu.Tension_service.includes('5V'))) {
    anomaliesCourantes.add("tension");
  }

  if ((feu.optiqueCentre === 'NOK') ||
      (feu.optiqueHaut === 'NOK') ||
      (feu.optiqueBas === 'NOK') ||
      (feu.Etat_optique_central === 'NOK') ||
      (feu.Etat_optique_haut === 'NOK') ||
      (feu.Etat_optique_bas === 'NOK')) {
    anomaliesCourantes.add("optique");
  }

  const autonomie = feu.autonomie || feu.Autonomie;
  if (autonomie && autonomie.includes('h')) {
    const heures = parseInt(autonomie);
    if (!isNaN(heures) && heures < 5) {
      anomaliesCourantes.add("autonomie");
    }
  }

  const anomaliesPrecedentes = anomaliesSignalees.get(feuId) || new Set();
  const nouvellesAnomalies = new Set(
    [...anomaliesCourantes].filter(type => !anomaliesPrecedentes.has(type))
  );
  const anomaliesResolues = new Set(
    [...anomaliesPrecedentes].filter(type => !anomaliesCourantes.has(type))
  );

  let emailEnvoye = false;

  // Si nous avons de nouvelles anomalies, envoyer un email
  if (nouvellesAnomalies.size > 0) {

    const messages = [];
    if (nouvellesAnomalies.has("tension")) {
      messages.push("Tension de service anormale: " + (feu.tension_service || feu.Tension_service));
    }
    if (nouvellesAnomalies.has("optique")) {
      messages.push("État optique défectueux détecté");
    }
    if (nouvellesAnomalies.has("autonomie")) {
      messages.push("Autonomie critique: " + (feu.autonomie || feu.Autonomie));
    }

    const messageAnomalie = messages.join(", ");
    console.log(`ALERTE! Nouvelles anomalies pour ${feuId}: ${messageAnomalie}`);

    try {
      // Envoyer l'alerte par email
      envoyerAlerte(feu, messageAnomalie);
      emailEnvoye = true;
    } catch (error) {
      console.error(`ERREUR lors de l'envoi de l'email pour ${feuId}: ${error.message}`);
    }

    // Envoyer l'alerte au frontend
    try {
      io.emit('feu_anomalie', {
        id: feuId,
        type: 'anomalie',
        message: messageAnomalie,
        details: feu,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error(`ERREUR lors de l'envoi de la notification pour ${feuId}: ${error.message}`);
    }
  }


  if (anomaliesResolues.size > 0) {
    // Construire le message de résolution pour l'envoyer
    const messages = [];
    if (anomaliesResolues.has("tension")) {
      messages.push("Tension de service normalisée");
    }
    if (anomaliesResolues.has("optique")) {
      messages.push("État optique rétabli");
    }
    if (anomaliesResolues.has("autonomie")) {
      messages.push("Autonomie rétablie");
    }

    const messageResolution = messages.join(", ");
    console.log(`RÉSOLUTION! Anomalies résolues pour ${feuId}: ${messageResolution}`);

    // Envoyer la notification au frontend
    try {
      io.emit('feu_resolution', {
        id: feuId,
        type: 'resolution',
        message: messageResolution,
        details: feu,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error(`ERREUR lors de l'envoi de la notification de résolution pour ${feuId}: ${error.message}`);
    }
  }

  // Mettre à jour les anomalies SIGNALÉES
  if (anomaliesCourantes.size > 0) {
    anomaliesSignalees.set(feuId, anomaliesCourantes);
  } else if (anomaliesPrecedentes.size > 0) {
    anomaliesSignalees.delete(feuId);
  }

  // Retourner un objet avec plus d'informations pour permettre au code appelant
  // de savoir si un email a déjà été envoyé
  if (anomaliesCourantes.size > 0) {
    return {
      message: "Anomalies: " + [...anomaliesCourantes].join(", "),
      emailEnvoye: emailEnvoye,
      nouvellesAnomalies: [...nouvellesAnomalies],
      anomaliesResolues: [...anomaliesResolues]
    };
  } else {
    return null;
  }
}
